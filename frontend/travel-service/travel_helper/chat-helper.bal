import ballerina/log;
import ballerina/os;

// Simple rule-based chat helper to power frontend chat assistant.
// Returns a map<json> object: { success: true, reply: string, changes?: json }

public function generateChatReply(string message, json? plan) returns json {
    // Dynamic chat helper that calls the enhanced AI planner and can apply a pending suggestion
    string lower = string:toLowerAscii(string:trim(message));
    log:printInfo(string `Chat helper received message: ${message}`);

    map<json> resp = {};
    resp["success"] = true;

    // --- Extract plan parameters (safe defaults) ---
    int days = 5;
    decimal budget = 1000.0d;
    string travelStyle = "balanced";
    string[] interests = [];
    string[] destinations = [];
    string startingLocation = "";

    if (plan is map<json>) {
        map<json> planMap = <map<json>>plan;
        // Prefer structured summary.totalDays (safe nested access)
        if (planMap["summary"] is map<json>) {
            map<json> summary = <map<json>>planMap["summary"];
            if (summary["totalDays"] is int) {
                days = <int>summary["totalDays"];
            }
        } else if (planMap["days"] is int) {
            days = <int>planMap["days"];
        } else if (planMap["duration"] is string) {
            // attempt to parse a leading integer (e.g. "5 days")
            string dur = <string>planMap["duration"];
            // Extract leading integer from strings like "5 days" or "10-day"
            string digits = "";
            int idx = 0;
            while idx < dur.length() {
                string ch = string:substring(dur, idx, idx + 1);
                if (ch >= "0" && ch <= "9") {
                    digits += ch;
                    idx += 1;
                } else {
                    break;
                }
            }
            if (digits != "") {
                var maybe = int:fromString(digits);
                if (maybe is int) {
                    days = maybe;
                }
            }
        }

        if (planMap["totalBudget"] is int) {
            budget = <decimal><int>planMap["totalBudget"];
        } else if (planMap["totalBudget"] is decimal) {
            budget = <decimal>planMap["totalBudget"];
        } else if (planMap["budget"] is int) {
            budget = <decimal><int>planMap["budget"];
        }

        if (planMap["travelStyle"] is string) {
            travelStyle = <string>planMap["travelStyle"];
        }

        // Try several popular keys for interests and destinations
        if (planMap["userInterests"] is json[]) {
            foreach json it in <json[]>planMap["userInterests"] { if (it is string) { interests.push(it); } }
        } else if (planMap["interests"] is json[]) {
            foreach json it in <json[]>planMap["interests"] { if (it is string) { interests.push(it); } }
        }

        if (planMap["destinations"] is json[]) {
            foreach json d in <json[]>planMap["destinations"] { if (d is string) { destinations.push(d); } }
        }

        if (planMap["startingLocation"] is string) {
            startingLocation = <string>planMap["startingLocation"];
        } else if (planMap["start"] is string) {
            startingLocation = <string>planMap["start"];
        }
    }

    // Helper: simple affirmative detection
    boolean userAffirmative = (lower == "yes" || lower == "y" || lower == "sure" || lower == "ok" || lower == "okay");

    // Read AI provider env for chat: prefer CHAT_AI_PROVIDER, then AI_PROVIDER, default to builtin
    string aiProvider = os:getEnv("CHAT_AI_PROVIDER");
    if aiProvider == "" {
        aiProvider = os:getEnv("AI_PROVIDER");
    }
    if aiProvider == "" {
        aiProvider = "builtin";
    }

    // If user confirms and there's a pending suggestion in the provided plan, attempt to apply it by
    // transforming planner inputs and re-calling the enhanced AI planner.
    if (userAffirmative && plan is map<json> && plan["pendingSuggestion"] is json) {
        string suggestion = "";
        if (plan["pendingSuggestion"] is string) {
            suggestion = <string>plan["pendingSuggestion"];
        } else {
            suggestion = plan["pendingSuggestion"].toString();
        }

        string sLower = string:toLowerAscii(suggestion);

        // Prepare a modifiable copy of planner inputs
        int callDays = days;
        decimal callBudget = budget;
        string callTravelStyle = travelStyle;
        string[] callInterests = [];
        foreach string it in interests { callInterests.push(it); }
        string[] callDestinations = [];
        foreach string d in destinations { callDestinations.push(d); }
        string callStart = startingLocation;

        // Map common suggestion keywords to planner input changes
        if (string:includes(sLower, "budget") || string:includes(sLower, "cheaper") || string:includes(sLower, "cost") || string:includes(sLower, "money")) {
            // apply budget-friendly adjustment (reduce budget by 25% as a heuristic)
            callBudget = callBudget * 0.75d;
            // encourage budget-oriented selections by setting a balanced style
            callTravelStyle = "balanced";
        } else if (string:includes(sLower, "beach") || string:includes(sLower, "coast") || string:includes(sLower, "coastal")) {
            // prefer beach interests and ensure at least one beach destination fallback
            callInterests.push("beach");
            if (callDestinations.length() == 0) {
                callDestinations.push("d3");
            }
        } else if (string:includes(sLower, "cultural") || string:includes(sLower, "temple") || string:includes(sLower, "history")) {
            callInterests.push("culture");
        } else if (string:includes(sLower, "food") || string:includes(sLower, "dining") || string:includes(sLower, "restaurant")) {
            callInterests.push("food");
        } else if (string:includes(sLower, "rest") || string:includes(sLower, "relax") || string:includes(sLower, "spa")) {
            callTravelStyle = "chill";
        }

        // Call the selected AI planner to produce an updated plan (handle errors locally)
        json|error aiResult;
        if (aiProvider == "groq") {
            aiResult = callGroqFromBallerina(suggestion, plan);
        } else {
            aiResult = callEnhancedAIPlanner("ChatSuggestion", callDays, callBudget, callTravelStyle, callInterests, callDestinations, callStart);
        }
        if (aiResult is json) {
            // Store original plan backup so frontend can revert if needed
            if (plan is map<json>) {
                map<json> pm = <map<json>>plan;
                // Always store a backup (overwrite if present)
                pm["originalPlan"] = plan;
            }

            resp["reply"] = "Okay — applied the suggestion and generated an updated plan for you.";
            resp["appliedSuggestion"] = suggestion;
            resp["suggestedPlan"] = aiResult;
            resp["plan"] = aiResult; // return the updated plan as the current plan
            resp["success"] = true;
            return resp;
        } else {
            log:printError("AI planner failed while applying suggestion", aiResult);
            resp["reply"] = "Sorry, I couldn't generate an updated plan right now. Please try again later.";
            resp["success"] = false;
            return resp;
        }
    }

    // If the message looks like a request to generate or modify a plan, call the planner and return its result
    boolean wantsPlan = false;
    if (string:includes(lower, "suggest") || string:includes(lower, "plan") || string:includes(lower, "recommend") || string:includes(lower, "generate") || string:includes(lower, "optimi") || string:includes(lower, "itinerary") || string:includes(lower, "add ") || string:includes(lower, "make ")) {
        wantsPlan = true;
    }

    // Also trigger planner for domain keywords
    if (!wantsPlan) {
        string[] kws = ["beach", "budget", "cheaper", "cultural", "temple", "food", "hotel", "transport", "rest", "relax", "dining", "hotel"]; 
        foreach string k in kws {
            if (string:includes(lower, k)) {
                wantsPlan = true;
                break;
            }
        }
    }

    if (wantsPlan) {
        // Prepare inputs influenced by the user's message
        int callDays = days;
        decimal callBudget = budget;
        string callTravelStyle = travelStyle;
        string[] callInterests = [];
        foreach string it in interests { callInterests.push(it); }
        string[] callDestinations = [];
        foreach string d in destinations { callDestinations.push(d); }
        string callStart = startingLocation;

        if (string:includes(lower, "beach") || string:includes(lower, "coast") || string:includes(lower, "coastal")) {
            callInterests.push("beach");
            if (callDestinations.length() == 0) { callDestinations.push("d3"); }
        }
        if (string:includes(lower, "cheap") || string:includes(lower, "cheaper") || string:includes(lower, "budget") || string:includes(lower, "cost")) {
            callBudget = callBudget * 0.75d;
            callTravelStyle = "balanced";
        }
        if (string:includes(lower, "cultural") || string:includes(lower, "temple") || string:includes(lower, "history")) {
            callInterests.push("culture");
        }
        if (string:includes(lower, "food") || string:includes(lower, "dining") || string:includes(lower, "restaurant")) {
            callInterests.push("food");
        }
        if (string:includes(lower, "rest") || string:includes(lower, "relax") || string:includes(lower, "spa")) {
            callTravelStyle = "chill";
        }

        json|error aiResult;
        if (aiProvider == "groq") {
            aiResult = callGroqFromBallerina(message, plan);
        } else {
            aiResult = callEnhancedAIPlanner("ChatRequest", callDays, callBudget, callTravelStyle, callInterests, callDestinations, callStart);
        }
        if (aiResult is json) {
            resp["reply"] = "Here is a suggested plan I generated based on your message. Reply 'yes' to apply this suggestion to your plan.";
            resp["suggestedPlan"] = aiResult;
            // provide the suggestion text so frontend may set pendingSuggestion for the next turn
            resp["pendingSuggestion"] = message;
            resp["plan"] = aiResult; // include the suggested plan as a full plan
            return resp;
        } else {
            log:printError("AI planner failed to generate suggestion", aiResult);
            resp["reply"] = "Sorry, I couldn't generate a plan just now. Try again in a moment.";
            resp["success"] = false;
            return resp;
        }
    }

    // If there's a pending suggestion but user hasn't confirmed yet, surface it
    // Undo / revert support: restore backup if requested
    if (string:includes(lower, "revert") || string:includes(lower, "undo") || string:includes(lower, "restore")) {
        if (plan is map<json>) {
            map<json> pm = <map<json>>plan;
            if (pm["originalPlan"] != ()) {
                resp["reply"] = "Restored your previous plan.";
                resp["plan"] = pm["originalPlan"];
                // clear originalPlan after restoring
                _ = pm.remove("originalPlan");
                resp["success"] = true;
                return resp;
            }
        }
        resp["reply"] = "I don't have a previous plan to restore.";
        resp["success"] = false;
        return resp;
    }

    if (plan is map<json> && plan["pendingSuggestion"] is json) {
        resp["reply"] = string `I have a pending suggestion: ${plan["pendingSuggestion"].toString()} — reply 'yes' to apply it.`;
        return resp;
    }

    // Generic fallback
    resp["reply"] = "🤖 I'm your travel assistant. Tell me what you'd like to change (e.g. 'Make it cheaper', 'Add beach day', 'More cultural'), or ask me to generate a suggestion.";
    return resp;
}
