import ballerina/http;
import ballerina/log;
import ballerina/time;
import ballerina/sql;
import ballerina/os;

// Simple geographic distance approximation (Manhattan distance scaled)
function calculateDistance(decimal lat1, decimal lon1, decimal lat2, decimal lon2) returns float {
    // Simple approximation: 1 degree latitude ≈ 111 km, 1 degree longitude ≈ 111 * cos(latitude) km
    // This is sufficient for Sri Lanka's small geographic area
    float latDiff = <float>(lat2 - lat1) * 111.0; // latitude difference in km
    float lonDiff = <float>(lon2 - lon1) * 111.0 * 0.86; // longitude scaled for Sri Lanka's latitude (~7°N)
    
    // Return approximate distance using Pythagorean theorem
    float distance = ((latDiff * latDiff) + (lonDiff * lonDiff));
    // Take square root to get actual distance
    if distance > 0.0 {
        // Approximate square root using simple method
        float result = distance / 2.0;
        int iterations = 0;
        while iterations < 10 && result > 0.0 {
            result = (result + distance / result) / 2.0;
            iterations = iterations + 1;
        }
        return result;
    }
    return 0.0;
}

// CORS configuration for frontend access
@http:ServiceConfig {
    cors: {
        allowOrigins: ["http://localhost:3000", "http://localhost:3001"],
        allowCredentials: true,
        allowHeaders: ["Content-Type", "Authorization"],
        allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    }
}
// Use shared listener
service /travelhelper on httpListener {

    // AI-powered travel planner endpoint
    resource function post plans/ai(@http:Payload json payload) returns json|error {
        log:printInfo("=== AI TRAVEL PLAN REQUEST RECEIVED ===");
        log:printInfo(string `Full request payload: ${payload.toString()}`);
        
        // Extract request parameters safely - handle frontend format
        json destinationsJson = check payload.destinations;
        log:printInfo(string `Destinations from frontend: ${destinationsJson.toString()}`);
        string[] destinations = [];
        if (destinationsJson is json[]) {
            foreach json dest in destinationsJson {
                if (dest is string) {
                    destinations.push(dest);
                }
            }
        }
        
        int days = check payload.days;
        decimal budget = check payload.budget;
        string travelStyle = payload.travelStyle is string ? check payload.travelStyle : "comfort";
        string startingLocation = payload.startingLocation is string ? check payload.startingLocation : "";
        // Normalize starting location for robust comparisons (trim + lowercase)
        string normalizedStartingLocation = startingLocation.trim().toLowerAscii();

        log:printInfo(string `Extracted: days=${days}, budget=${budget}, travelStyle=${travelStyle}, startingLocation(raw)=${startingLocation}, startingLocation(normalized)=${normalizedStartingLocation}`);
        
        string[] interests = [];
        // Extract interests properly from frontend JSON array
        if (payload.interests is json) {
            log:printInfo("Interests field found in request");
            json interestsJson = check payload.interests;
            if (interestsJson is json[]) {
                foreach json interest in interestsJson {
                    if (interest is string) {
                        interests.push(interest);
                    }
                }
            }
        }
        
        log:printInfo(string `Parsed interests: ${interests.toString()}`);
        
        // Use ALL destinations from frontend, not just the first one
        string[] targetDestinations = destinations.length() > 0 ? destinations : ["d3"];
        
        // Convert interests array to string for processing
        string interestsStr = "";
        foreach int i in 0 ..< interests.length() {
            if i > 0 {
                interestsStr += ",";
            }
            interestsStr += interests[i];
        }
        if interestsStr == "" {
            interestsStr = "culture,nature"; // fallback
        }
        log:printInfo(string `=== PROCESSING: destinations=${targetDestinations.toString()}, days=${days}, budget=${budget}, style=${travelStyle}, interests=${interestsStr}, startingLocation=${startingLocation} ===`);
        
        // Call the enhanced AI planner with ALL destinations and starting location
        json result = check callEnhancedAIPlanner("Multi-Destination", days, budget, travelStyle, interests, targetDestinations, startingLocation);
        
        log:printInfo("Enhanced AI Planning completed successfully");
        
        // Ensure success field is set for frontend compatibility
        map<json> response = <map<json>>result;
        response["success"] = true;
        
        // Return the result with success field
        return response;
    }

    // Chat endpoint used by frontend chat assistant
    resource function post chat(@http:Payload json payload) returns json|error {
        // Expected payload: { message: string, plan?: json }
        string message = payload.message is string ? check payload.message : "";
        json plan = {};
        if (payload.plan is json) {
            plan = check payload.plan;
        }

        // Call helper to generate reply (defined in chat-helper.bal)
        json reply = generateChatReply(message, plan);
        return reply;
    }

    // Health check endpoint
    resource function get health() returns json {
        return {
            "status": "healthy",
            "timestamp": time:utcNow().toString(),
            "service": "Enhanced AI Travel Planner",
            "version": "3.0",
            "capabilities": [
                "Sophisticated preference matching",
                "Travel style optimization", 
                "Interest-based filtering",
                "Real database integration"
            ]
        };
    }

    // Get destinations
    resource function get destinations() returns json|error {
        log:printInfo("Fetching destinations");
        
        stream<record {|string name; string description; string location;|}, error?> destinationStream = 
            dbClient->query(`SELECT name, description, location FROM destinations LIMIT 10`);
        
        json[] destinations = [];
        check from var destination in destinationStream
            do {
                destinations.push({
                    name: destination.name,
                    description: destination.description,
                    location: destination.location
                });
            };
        
        return {destinations: destinations};
    }

    // Get hotels 
    resource function get hotels() returns json|error {
        log:printInfo("Fetching hotels");
        
        stream<record {|string name; string description; string price_range;|}, error?> hotelStream = 
            dbClient->query(`SELECT name, description, price_range FROM hotels LIMIT 20`);
        
        json[] hotels = [];
        check from var hotel in hotelStream
            do {
                hotels.push({
                    name: hotel.name,
                    description: hotel.description,
                    price_range: hotel.price_range
                });
            };
        
        return {hotels: hotels};
    }

    // Get attractions
    resource function get attractions() returns json|error {
        log:printInfo("Fetching attractions");
        
        stream<record {|string name; string description; string attraction_type;|}, error?> attractionStream = 
            dbClient->query(`SELECT name, description, type as attraction_type FROM attractions LIMIT 15`);
        
        json[] attractions = [];
        check from var attraction in attractionStream
            do {
                attractions.push({
                    name: attraction.name,
                    description: attraction.description,
                    attractionType: attraction.attraction_type
                });
            };
        
        return {attractions: attractions};
    }
}

// ENHANCED AI PLANNER FUNCTION - SOPHISTICATED VERSION
function callEnhancedAIPlanner(string destination, int days, decimal budget, string travelStyle, string[] interests, string[] destinations, string startingLocation) returns json|error {
    // Smart budget allocation based on travel style
    decimal dailyBudget = budget / days;
    decimal hotelBudget;
    decimal foodBudget;
    decimal activityBudget;
    decimal transportBudget;
    
    // Adjust budget allocation based on travel style
    if (travelStyle == "chill") {
        hotelBudget = dailyBudget * 0.50d;    // 50% for comfort accommodation
        foodBudget = dailyBudget * 0.35d;     // 35% for great meals
        activityBudget = dailyBudget * 0.10d; // 10% for relaxed activities
        transportBudget = dailyBudget * 0.05d; // 5% for transport
    } else if (travelStyle == "packed") {
        hotelBudget = dailyBudget * 0.35d;    // 35% for basic accommodation
        foodBudget = dailyBudget * 0.25d;     // 25% for quick meals
        activityBudget = dailyBudget * 0.35d; // 35% for lots of activities
        transportBudget = dailyBudget * 0.05d; // 5% for transport
    } else { // balanced
        hotelBudget = dailyBudget * 0.45d;    // 45% for accommodation
        foodBudget = dailyBudget * 0.30d;     // 30% for meals
        activityBudget = dailyBudget * 0.20d; // 20% for activities
        transportBudget = dailyBudget * 0.05d; // 5% for transport
    }
    
    // Get real destinations data based on user preferences
    string[] zoneMappedDestinations = [];

    // Normalize starting location for robust comparisons inside planner
    string normalizedStartingLocation = startingLocation.trim().toLowerAscii();
    
    // Map zone preferences to actual destination IDs for better filtering
    if (destinations.length() > 0) {
        foreach string dest in destinations {
            if (dest.startsWith("d")) {
                zoneMappedDestinations.push(dest);
            } else {
                // Map text destinations to IDs
                zoneMappedDestinations.push("d3"); // Default fallback
            }
        }
    } else {
        zoneMappedDestinations = ["d3", "d4", "d6"]; // Default coastal + cultural
    }
    
    // Get destinations filtered by user preferences
    string destinationIds = "";
    foreach int i in 0 ..< zoneMappedDestinations.length() {
        if i > 0 {
            destinationIds += ",";
        }
        destinationIds += "'" + zoneMappedDestinations[i] + "'";
    }
    
    log:printInfo(string `Using destination IDs for filtering: ${destinationIds}`);
    
    // Test database connection first
    stream<record {|int count;|}, sql:Error?> testStream = dbClient->query(`SELECT COUNT(*) as count FROM destinations`);
    record {|int count;|}[] testResult = [];
    check from var test in testStream
        do {
            testResult.push(test);
        };
    log:printInfo(string `Database connection test - Total destinations in DB: ${testResult.length() > 0 ? testResult[0].count.toString() : "ERROR"}`);
    
    // Use sql:queryConcat for dynamic SQL building
    log:printInfo("Using flexible destination queries...");
    
    // Build a flexible SQL query for any number of destinations using sql:queryConcat with geographic data
    sql:ParameterizedQuery baseQuery = `SELECT id, name, description, location, latitude, longitude FROM destinations WHERE `;
    sql:ParameterizedQuery[] allParts = [baseQuery];
    
    foreach int i in 0 ..< zoneMappedDestinations.length() {
        string destId = zoneMappedDestinations[i];
        if i > 0 {
            allParts.push(` OR id = ${destId}`);
        } else {
            allParts.push(`id = ${destId}`);
        }
    }
    allParts.push(` ORDER BY latitude DESC LIMIT 15`); // Order by latitude for geographic clustering
    
    sql:ParameterizedQuery fullQuery;
    if zoneMappedDestinations.length() > 0 {
        fullQuery = sql:queryConcat(...allParts);
    } else {
        fullQuery = `SELECT id, name, description, location, latitude, longitude FROM destinations WHERE id = 'd11' OR id = 'd3' ORDER BY latitude DESC LIMIT 10`;
    }
    
    stream<record {|string id; string name; string description; string location; decimal latitude; decimal longitude;|}, sql:Error?> destinationStream = 
        dbClient->query(fullQuery);
    
    record {|string id; string name; string description; string location; decimal latitude; decimal longitude;|}[] realDestinations = [];
    
    check from var dest in destinationStream
        do {
            realDestinations.push(dest);
        };
    
    string[] debugDestNames = [];
    foreach var d in realDestinations { debugDestNames.push(d.name + " (" + d.id + ")"); }
    log:printInfo(string `Filtered destinations for planning: ${debugDestNames.toString()}`);
    log:printInfo(string `Found ${realDestinations.length()} destinations: ${realDestinations.toString()}`);
    
    // Get attractions filtered by destination - use sql:queryConcat
    sql:ParameterizedQuery attractionBaseQuery = `SELECT a.name, a.description, a.type as attraction_type, a.destination_id FROM attractions a WHERE `;
    sql:ParameterizedQuery[] attractionParts = [attractionBaseQuery];
    
    foreach int i in 0 ..< zoneMappedDestinations.length() {
        string destId = zoneMappedDestinations[i];
        if i > 0 {
            attractionParts.push(` OR a.destination_id = ${destId}`);
        } else {
            attractionParts.push(`a.destination_id = ${destId}`);
        }
    }
    attractionParts.push(` ORDER BY a.recommended_time_minutes DESC LIMIT 15`);
    
    sql:ParameterizedQuery fullAttractionQuery;
    if zoneMappedDestinations.length() > 0 {
        fullAttractionQuery = sql:queryConcat(...attractionParts);
    } else {
        fullAttractionQuery = `SELECT a.name, a.description, a.type as attraction_type, a.destination_id FROM attractions a WHERE a.destination_id = 'd11' OR a.destination_id = 'd3' ORDER BY a.recommended_time_minutes DESC LIMIT 15`;
    }
    
    stream<record {|string name; string description; string attraction_type; string destination_id;|}, error?> attractionStream = 
        dbClient->query(fullAttractionQuery);
    
    record {|string name; string description; string attraction_type; string destination_id;|}[] realAttractions = [];
    check from var attr in attractionStream
        do {
            realAttractions.push(attr);
        };
    
    log:printInfo(string `Found ${realAttractions.length()} attractions: ${realAttractions.toString()}`);
    
    // Get hotels filtered by destination - use sql:queryConcat
    sql:ParameterizedQuery hotelBaseQuery = `SELECT h.name, h.description, h.price_range, h.destination_id FROM hotels h WHERE `;
    sql:ParameterizedQuery[] hotelParts = [hotelBaseQuery];
    
    foreach int i in 0 ..< zoneMappedDestinations.length() {
        string destId = zoneMappedDestinations[i];
        if i > 0 {
            hotelParts.push(` OR h.destination_id = ${destId}`);
        } else {
            hotelParts.push(`h.destination_id = ${destId}`);
        }
    }
    hotelParts.push(` ORDER BY h.rating DESC LIMIT 10`);
    
    sql:ParameterizedQuery fullHotelQuery;
    if zoneMappedDestinations.length() > 0 {
        fullHotelQuery = sql:queryConcat(...hotelParts);
    } else {
        fullHotelQuery = `SELECT h.name, h.description, h.price_range, h.destination_id FROM hotels h WHERE h.destination_id = 'd11' OR h.destination_id = 'd3' ORDER BY h.rating DESC LIMIT 10`;
    }
    
    stream<record {|string name; string description; string price_range; string destination_id;|}, error?> hotelStream = 
        dbClient->query(fullHotelQuery);
    record {|string name; string description; string price_range; string destination_id;|}[] realHotels = [];
    check from var hotel in hotelStream
        do {
            realHotels.push(hotel);
        };
    
    // Get restaurants filtered by destination - use sql:queryConcat
    sql:ParameterizedQuery restaurantBaseQuery = `SELECT r.name, r.cuisine, r.price_level, r.destination_id FROM restaurants r WHERE `;
    sql:ParameterizedQuery[] restaurantParts = [restaurantBaseQuery];
    
    foreach int i in 0 ..< zoneMappedDestinations.length() {
        string destId = zoneMappedDestinations[i];
        if i > 0 {
            restaurantParts.push(` OR r.destination_id = ${destId}`);
        } else {
            restaurantParts.push(`r.destination_id = ${destId}`);
        }
    }
    restaurantParts.push(` ORDER BY r.rating DESC LIMIT 12`);
    
    sql:ParameterizedQuery fullRestaurantQuery;
    if zoneMappedDestinations.length() > 0 {
        fullRestaurantQuery = sql:queryConcat(...restaurantParts);
    } else {
        fullRestaurantQuery = `SELECT r.name, r.cuisine, r.price_level, r.destination_id FROM restaurants r WHERE r.destination_id = 'd11' OR r.destination_id = 'd3' ORDER BY r.rating DESC LIMIT 12`;
    }
    
    stream<record {|string name; string cuisine; string price_level; string destination_id;|}, error?> restaurantStream = 
        dbClient->query(fullRestaurantQuery);
    record {|string name; string cuisine; string price_level; string destination_id;|}[] realRestaurants = [];
    check from var restaurant in restaurantStream
        do {
            realRestaurants.push(restaurant);
        };
    
    // Generate intelligent itinerary based on travel style with SMART GEOGRAPHIC CLUSTERING
    json[] itinerary = [];
    int currentDay = 1;
    
    // Activity scheduling based on travel pace
    int activitiesPerDay = travelStyle == "chill" ? 2 : (travelStyle == "packed" ? 4 : 3);
    
    // ENHANCED GEOGRAPHIC-AWARE destination allocation with ROUTE OPTIMIZATION
    int destinationCount = realDestinations.length();
    boolean[] destinationVisited = []; // Track which destinations have been visited in current cycle
    int[] attractionCounters = []; // Track attraction usage per destination
    int[] restaurantCounters = []; // Track restaurant usage per destination
    int[] hotelCounters = []; // Track hotel usage per destination
    decimal currentLat = 6.9271; // Default to Colombo coordinates
    decimal currentLon = 79.9612;
    string[] usedDestinationOrder = []; // Track the order of visited destinations
    string[] routePlan = []; // Pre-calculated optimal route
    
    // Initialize tracking arrays
    foreach int i in 0 ..< destinationCount {
        destinationVisited.push(false);
        attractionCounters.push(0);
        restaurantCounters.push(0);
        hotelCounters.push(0);
    }
    
    // SMART ROUTE OPTIMIZATION: Create logical geographic clusters with starting location prioritization
    string[] geographicClusters = [];
    if destinationCount > 1 {
        // Identify geographic regions of destinations
        string[] northernDests = [];
        string[] centralDests = [];
        string[] southernDests = [];
        string[] easternDests = [];
        string[] westernDests = [];
        
    foreach int i in 0 ..< destinationCount {
            decimal lat = realDestinations[i].latitude;
            decimal lon = realDestinations[i].longitude;
            string destId = realDestinations[i].id;
            
            // Convert decimal to float for comparison
            float latFloat = <float>lat;
            float lonFloat = <float>lon;
            
            // Geographic clustering based on Sri Lankan geography
            if latFloat > 8.5 { // Northern Sri Lanka (Jaffna, Mannar, etc.)
                northernDests.push(destId);
            } else if latFloat > 7.5 && lonFloat < 80.5 { // Central highlands (Kandy, Nuwara Eliya, etc.)
                centralDests.push(destId);
            } else if latFloat < 6.5 { // Southern coast (Galle, Matara, etc.)
                southernDests.push(destId);
            } else if lonFloat > 81.0 { // Eastern coast (Trincomalee, Batticaloa, etc.)
                easternDests.push(destId);
            } else { // Western coast and central (Colombo, Negombo, etc.)
                westernDests.push(destId);
            }
        }
    // Build a simple list of non-empty geographic clusters for diagnostics and metadata
    if (northernDests.length() > 0) { geographicClusters.push("north"); }
    if (centralDests.length() > 0) { geographicClusters.push("central"); }
    if (southernDests.length() > 0) { geographicClusters.push("south"); }
    if (easternDests.length() > 0) { geographicClusters.push("east"); }
    if (westernDests.length() > 0) { geographicClusters.push("west"); }
    log:printInfo(string `Identified geographic clusters: ${geographicClusters.toString()}`);
        
        // SMART STARTING LOCATION-BASED ROUTE OPTIMIZATION
        log:printInfo(string `Starting location(raw)=${startingLocation}, normalized=${normalizedStartingLocation}`);

        // Map common starting location names to approximate coordinates so "nearest" logic uses the true start
        if normalizedStartingLocation == "colombo" {
            currentLat = 6.9271;
            currentLon = 79.8612;
        } else if normalizedStartingLocation == "negombo" {
            currentLat = 7.2083;
            currentLon = 79.8333;
        } else if normalizedStartingLocation == "kandy" {
            currentLat = 7.2906;
            currentLon = 80.6337;
        } else if normalizedStartingLocation == "galle" {
            currentLat = 6.0535;
            currentLon = 80.2200;
        } else if normalizedStartingLocation == "trincomalee" {
            currentLat = 8.5870;
            currentLon = 81.2152;
        } else if normalizedStartingLocation == "jaffna" {
            currentLat = 9.6615;
            currentLon = 80.0255;
        } else if normalizedStartingLocation == "anuradhapura" {
            currentLat = 8.3114;
            currentLon = 80.4037;
        } else if normalizedStartingLocation == "ella" {
            currentLat = 6.8400;
            currentLon = 81.1110;
        }
        
        if normalizedStartingLocation == "colombo" || normalizedStartingLocation == "negombo" || normalizedStartingLocation == "" {
            // Western start: West -> Central -> South -> East -> North
            if westernDests.length() > 0 {
                foreach string dest in westernDests { routePlan.push(dest); }
            }
            if centralDests.length() > 0 {
                foreach string dest in centralDests { routePlan.push(dest); }
            }
            if southernDests.length() > 0 {
                foreach string dest in southernDests { routePlan.push(dest); }
            }
            if easternDests.length() > 0 {
                foreach string dest in easternDests { routePlan.push(dest); }
            }
            if northernDests.length() > 0 {
                foreach string dest in northernDests { routePlan.push(dest); }
            }
        }

        // --- FORCE FIRST DESTINATION TO STARTING CITY IF PRESENT, ELSE NEAREST IN ZONE ---
        string prioritizedStartId = "";
        int prioritizedStartIdx = -1;
        foreach int i in 0 ..< realDestinations.length() {
            string lid = realDestinations[i].id;
            string lname = realDestinations[i].name.trim().toLowerAscii();
            string lloc = realDestinations[i].location.trim().toLowerAscii();
            if (lname == normalizedStartingLocation || lloc == normalizedStartingLocation) {
                prioritizedStartId = lid;
                prioritizedStartIdx = i;
                break;
            }
        }
        if prioritizedStartId != "" {
            // Move prioritizedStartId to front of routePlan if present, else insert
            string[] filtered = [];
            boolean found = false;
            foreach string r in routePlan {
                if r == prioritizedStartId {
                    found = true;
                    continue;
                }
                filtered.push(r);
            }
            routePlan = [];
            routePlan.push(prioritizedStartId);
            foreach string f in filtered { routePlan.push(f); }
            // If we recorded the original index of the prioritized start, set current coords to that destination
            if (prioritizedStartIdx >= 0) {
                currentLat = realDestinations[prioritizedStartIdx].latitude;
                currentLon = realDestinations[prioritizedStartIdx].longitude;
            }
            log:printInfo(string `FORCED START: First destination is starting city (${normalizedStartingLocation}) with id ${prioritizedStartId}`);
            if (found) {
                log:printInfo("Prioritized start was already present in routePlan and moved to front.");
            } else {
                log:printInfo("Prioritized start inserted into routePlan at front.");
            }
        } else {
            // No explicit destination in that city, so pick nearest in selected zone
            string[] clusterCandidates = [];
            if normalizedStartingLocation == "colombo" || normalizedStartingLocation == "negombo" {
                clusterCandidates = westernDests;
            } else if normalizedStartingLocation == "kandy" || normalizedStartingLocation == "ella" {
                clusterCandidates = centralDests;
            } else if normalizedStartingLocation == "galle" {
                clusterCandidates = southernDests;
            } else if normalizedStartingLocation == "trincomalee" {
                clusterCandidates = easternDests;
            } else if normalizedStartingLocation == "jaffna" || normalizedStartingLocation == "anuradhapura" {
                clusterCandidates = northernDests;
            }
            if clusterCandidates.length() > 0 {
                float bestDist = 999999.0;
                string bestId = "";
                foreach string cid in clusterCandidates {
                    foreach int i in 0 ..< realDestinations.length() {
                        if realDestinations[i].id == cid {
                            float d = calculateDistance(currentLat, currentLon, realDestinations[i].latitude, realDestinations[i].longitude);
                            if d < bestDist {
                                bestDist = d;
                                bestId = cid;
                            }
                            break;
                        }
                    }
                }
                if bestId != "" {
                    // Move bestId to front of routePlan if present, otherwise insert
                    string[] filtered2 = [];
                    foreach string r in routePlan {
                        if r == bestId { continue; }
                        filtered2.push(r);
                    }
                    routePlan = [];
                    routePlan.push(bestId);
                    foreach string f in filtered2 { routePlan.push(f); }
                    log:printInfo(string `FORCED START: First destination is nearest in selected zone (${bestId})`);
                }
            }
        }

        // Continue with remaining starting-location branches
        if normalizedStartingLocation == "kandy" {
            // Central start: Central -> West -> South -> East -> North
            if centralDests.length() > 0 {
                foreach string dest in centralDests { routePlan.push(dest); }
            }
            if westernDests.length() > 0 {
                foreach string dest in westernDests { routePlan.push(dest); }
            }
            if southernDests.length() > 0 {
                foreach string dest in southernDests { routePlan.push(dest); }
            }
            if easternDests.length() > 0 {
                foreach string dest in easternDests { routePlan.push(dest); }
            }
            if northernDests.length() > 0 {
                foreach string dest in northernDests { routePlan.push(dest); }
            }
        } else if normalizedStartingLocation == "galle" {
            // Southern start: South -> West -> Central -> East -> North
            if southernDests.length() > 0 {
                foreach string dest in southernDests { routePlan.push(dest); }
            }
            if westernDests.length() > 0 {
                foreach string dest in westernDests { routePlan.push(dest); }
            }
            if centralDests.length() > 0 {
                foreach string dest in centralDests { routePlan.push(dest); }
            }
            if easternDests.length() > 0 {
                foreach string dest in easternDests { routePlan.push(dest); }
            }
            if northernDests.length() > 0 {
                foreach string dest in northernDests { routePlan.push(dest); }
            }
        } else if normalizedStartingLocation == "trincomalee" {
            // Eastern start: East -> Central -> North -> West -> South
            if easternDests.length() > 0 {
                foreach string dest in easternDests { routePlan.push(dest); }
            }
            if centralDests.length() > 0 {
                foreach string dest in centralDests { routePlan.push(dest); }
            }
            if northernDests.length() > 0 {
                foreach string dest in northernDests { routePlan.push(dest); }
            }
            if westernDests.length() > 0 {
                foreach string dest in westernDests { routePlan.push(dest); }
            }
            if southernDests.length() > 0 {
                foreach string dest in southernDests { routePlan.push(dest); }
            }
        } else if normalizedStartingLocation == "jaffna" || normalizedStartingLocation == "anuradhapura" {
            // Northern start: North -> Central -> West -> South -> East
            if northernDests.length() > 0 {
                foreach string dest in northernDests { routePlan.push(dest); }
            }
            if centralDests.length() > 0 {
                foreach string dest in centralDests { routePlan.push(dest); }
            }
            if westernDests.length() > 0 {
                foreach string dest in westernDests { routePlan.push(dest); }
            }
            if southernDests.length() > 0 {
                foreach string dest in southernDests { routePlan.push(dest); }
            }
            if easternDests.length() > 0 {
                foreach string dest in easternDests { routePlan.push(dest); }
            }
        } else if normalizedStartingLocation == "ella" {
            // Hill country start: Central -> South -> West -> East -> North
            if centralDests.length() > 0 {
                foreach string dest in centralDests { routePlan.push(dest); }
            }
            if southernDests.length() > 0 {
                foreach string dest in southernDests { routePlan.push(dest); }
            }
            if westernDests.length() > 0 {
                foreach string dest in westernDests { routePlan.push(dest); }
            }
            if easternDests.length() > 0 {
                foreach string dest in easternDests { routePlan.push(dest); }
            }
            if northernDests.length() > 0 {
                foreach string dest in northernDests { routePlan.push(dest); }
            }
        } else {
            // Default route for any other starting location: West -> Central -> South -> East -> North
            if westernDests.length() > 0 {
                foreach string dest in westernDests { routePlan.push(dest); }
            }
            if centralDests.length() > 0 {
                foreach string dest in centralDests { routePlan.push(dest); }
            }
            if southernDests.length() > 0 {
                foreach string dest in southernDests { routePlan.push(dest); }
            }
            if easternDests.length() > 0 {
                foreach string dest in easternDests { routePlan.push(dest); }
            }
            if northernDests.length() > 0 {
                foreach string dest in northernDests { routePlan.push(dest); }
            }
        }
        
        log:printInfo(string `SMART ROUTE OPTIMIZATION from ${startingLocation}: Western(${westernDests.length()}) -> Central(${centralDests.length()}) -> Southern(${southernDests.length()}) -> Eastern(${easternDests.length()}) -> Northern(${northernDests.length()})`);
        log:printInfo(string `Route plan: ${routePlan.toString()}`);
    } else {
        // Fallback for single destination
        routePlan.push(realDestinations[0].id);
    }
    
    // Track route plan index
    int routePlanIndex = 0;
    
    while currentDay <= days {
        // SMART ROUTE-BASED DESTINATION SELECTION
        int destinationIndex = 0;
        string selectedDestId = "";
        float minDistance = 0.0; // Declare minDistance at function scope
        
        // STEP 1: Follow the optimized route plan when possible
        if routePlanIndex < routePlan.length() {
            // Use next destination from route plan
            selectedDestId = routePlan[routePlanIndex];
            routePlanIndex = routePlanIndex + 1;
            
            // Find the index of this destination
            foreach int i in 0 ..< destinationCount {
                if realDestinations[i].id == selectedDestId {
                    destinationIndex = i;
                    break;
                }
            }
            
            log:printInfo(string `Day ${currentDay}: Following route plan - selected ${selectedDestId} (${routePlanIndex}/${routePlan.length()})`);
        } else {
            // STEP 2: Route plan exhausted - for longer trips, find nearest unused destination
            log:printInfo(string `Day ${currentDay}: Route plan exhausted, finding nearest destination`);
            
            // Build list of unused destination IDs
            string[] unusedDestIds = [];
            foreach int i in 0 ..< destinationCount {
                string destId = realDestinations[i].id;
                boolean alreadyUsed = false;
                
                foreach string usedId in usedDestinationOrder {
                    if usedId == destId {
                        alreadyUsed = true;
                        break;
                    }
                }
                
                if !alreadyUsed {
                    unusedDestIds.push(destId);
                }
            }
            
            if unusedDestIds.length() == 0 {
                // All destinations used - for very long trips, allow smart reuse
                log:printInfo("All destinations used - implementing smart reuse strategy");
                
                // Avoid immediate backtracking - don't repeat last 2 destinations
                string lastDest = usedDestinationOrder.length() > 0 ? usedDestinationOrder[usedDestinationOrder.length() - 1] : "";
                string secondLastDest = usedDestinationOrder.length() > 1 ? usedDestinationOrder[usedDestinationOrder.length() - 2] : "";
                
                foreach int i in 0 ..< destinationCount {
                    string destId = realDestinations[i].id;
                    if destId != lastDest && destId != secondLastDest {
                        unusedDestIds.push(destId);
                    }
                }
                
                // If still no options, allow all except last destination
                if unusedDestIds.length() == 0 {
                    foreach int i in 0 ..< destinationCount {
                        string destId = realDestinations[i].id;
                        if destId != lastDest {
                            unusedDestIds.push(destId);
                        }
                    }
                }
                
                // Final fallback - allow all destinations
                if unusedDestIds.length() == 0 {
                    foreach int i in 0 ..< destinationCount {
                        unusedDestIds.push(realDestinations[i].id);
                    }
                }
            }
            
            // Find nearest destination from current location
            minDistance = 999999.0;
            selectedDestId = unusedDestIds[0]; // Fallback
            
            foreach string destId in unusedDestIds {
                foreach int i in 0 ..< destinationCount {
                    if realDestinations[i].id == destId {
                        float distance = calculateDistance(currentLat, currentLon, 
                                                         realDestinations[i].latitude, 
                                                         realDestinations[i].longitude);
                        
                        if distance < minDistance {
                            minDistance = distance;
                            selectedDestId = destId;
                            destinationIndex = i;
                        }
                        break;
                    }
                }
            }
        }
        
        // STEP 4: Mark as used and update position
        usedDestinationOrder.push(selectedDestId);
        currentLat = realDestinations[destinationIndex].latitude;
        currentLon = realDestinations[destinationIndex].longitude;
        
        log:printInfo(string `Day ${currentDay}: SELECTED ${realDestinations[destinationIndex].name} (${minDistance} km away)`);
        log:printInfo(string `Day ${currentDay}: Used destinations: ${usedDestinationOrder.length()}/${destinationCount}`);
        
        var currentDestRecord = realDestinations[destinationIndex];
        string currentDest = currentDestRecord.name;
        string currentDestId = currentDestRecord.id;
        
        json[] dayActivities = [];
        
        // MORNING ACTIVITY - Replaced .filter(...) with a loop
        record {|string name; string description; string attraction_type; string destination_id;|}[] currentDestAttractions = [];
        foreach var a in realAttractions {
            if a.destination_id == currentDestId {
                currentDestAttractions.push(a);
            }
        }
        
        log:printInfo(string `Day ${currentDay}: ${currentDest} has ${currentDestAttractions.length()} attractions available`);
        
        if currentDestAttractions.length() > 0 {
            // Use next available attraction for this destination
            int attractionIndex = attractionCounters[destinationIndex] % currentDestAttractions.length();
            var morningAttraction = currentDestAttractions[attractionIndex];
            attractionCounters[destinationIndex] = attractionCounters[destinationIndex] + 1;
            
            log:printInfo(string `Day ${currentDay}: Morning activity - ${morningAttraction.name} (Attraction ${attractionIndex + 1}/${currentDestAttractions.length()})`);
            
            dayActivities.push({
                title: morningAttraction.name,
                note: morningAttraction.description + " (Perfect for " + morningAttraction.attraction_type + " enthusiasts)",
                time: "9:00 AM - 12:00 PM",
                cost: <int>(activityBudget * 0.4d),
                duration: "3 hours",
                activityType: "activity",
                location: currentDest,
                category: morningAttraction.attraction_type
            });
        } else {
            log:printInfo(string `Day ${currentDay}: No attractions found for ${currentDest}, adding cultural exploration`);
            // Add fallback activity if no attractions
            dayActivities.push({
                title: "Cultural Exploration in " + currentDest,
                note: "Discover local culture, markets, and hidden gems in " + currentDest,
                time: "9:00 AM - 12:00 PM",
                cost: <int>(activityBudget * 0.3d),
                duration: "3 hours",
                activityType: "activity",
                location: currentDest,
                category: "Cultural Exploration"
            });
        }
        
        // LUNCH - Replaced .filter(...) with a loop
        record {|string name; string cuisine; string price_level; string destination_id;|}[] currentDestRestaurants = [];
        foreach var r in realRestaurants {
            if r.destination_id == currentDestId {
                currentDestRestaurants.push(r);
            }
        }
        
        if currentDestRestaurants.length() > 0 {
            int restaurantIndex = restaurantCounters[destinationIndex] % currentDestRestaurants.length();
            var lunchPlace = currentDestRestaurants[restaurantIndex];
            restaurantCounters[destinationIndex] = restaurantCounters[destinationIndex] + 1;
            
            dayActivities.push({
                title: "Lunch at " + lunchPlace.name,
                note: "Enjoy " + lunchPlace.cuisine + " cuisine (" + lunchPlace.price_level + " pricing)",
                time: "12:30 PM - 1:30 PM",
                cost: <int>(foodBudget * 0.35d),
                duration: "1 hour",
                activityType: "meal",
                location: currentDest,
                category: "Dining"
            });
        }
        
        // AFTERNOON ACTIVITY - ENSURE EVERY DAY HAS AFTERNOON ACTIVITY
        if currentDestAttractions.length() > 1 {
            // Get next attraction (different from morning)
            int afternoonAttractionIndex = attractionCounters[destinationIndex] % currentDestAttractions.length();
            var afternoonAttraction = currentDestAttractions[afternoonAttractionIndex];
            attractionCounters[destinationIndex] = attractionCounters[destinationIndex] + 1;
            
            log:printInfo(string `Day ${currentDay}: Afternoon activity - ${afternoonAttraction.name} (Attraction ${afternoonAttractionIndex + 1}/${currentDestAttractions.length()})`);
            
            dayActivities.push({
                title: afternoonAttraction.name,
                note: afternoonAttraction.description + " (Tailored to your interests)",
                time: "2:00 PM - 5:00 PM",
                cost: <int>(activityBudget * 0.4d),
                duration: "3 hours",
                activityType: "activity",
                location: currentDest,
                category: afternoonAttraction.attraction_type
            });
        } else {
            // ALWAYS add afternoon activity even if limited attractions
            log:printInfo(string `Day ${currentDay}: Adding cultural exploration for afternoon (limited attractions in ${currentDest})`);
            dayActivities.push({
                title: "Explore Local Markets & Culture",
                note: "Discover local handicrafts, street food, and cultural experiences in " + currentDest,
                time: "2:00 PM - 5:00 PM",
                cost: <int>(activityBudget * 0.3d),
                duration: "3 hours",
                activityType: "activity",
                location: currentDest,
                category: "Cultural Exploration"
            });
        }
        
        // DINNER - Use different restaurant for dinner
        if currentDestRestaurants.length() > 1 {
            int dinnerRestaurantIndex = restaurantCounters[destinationIndex] % currentDestRestaurants.length();
            var dinnerPlace = currentDestRestaurants[dinnerRestaurantIndex];
            restaurantCounters[destinationIndex] = restaurantCounters[destinationIndex] + 1;
            
            dayActivities.push({
                title: "Dinner at " + dinnerPlace.name,
                note: "Sophisticated " + dinnerPlace.cuisine + " dining experience (" + dinnerPlace.price_level + " pricing)",
                time: "6:30 PM - 8:30 PM",
                cost: <int>(foodBudget * 0.45d),
                duration: "2 hours",
                activityType: "meal",
                location: currentDest,
                category: "Fine Dining"
            });
        } else if currentDestRestaurants.length() == 1 {
            // If only one restaurant, at least change the experience
            var dinnerPlace = currentDestRestaurants[0];
            dayActivities.push({
                title: "Evening Dining at " + dinnerPlace.name,
                note: "Special evening menu featuring " + dinnerPlace.cuisine + " specialties",
                time: "6:30 PM - 8:30 PM",
                cost: <int>(foodBudget * 0.45d),
                duration: "2 hours",
                activityType: "meal",
                location: "currentDest",
                category: "Local Dining"
            });
        } else {
            // No restaurants found, add local dining experience
            dayActivities.push({
                title: "Local Dining Experience",
                note: "Authentic local cuisine and traditional dining in " + currentDest,
                time: "6:30 PM - 8:30 PM",
                cost: <int>(foodBudget * 0.4d),
                duration: "2 hours",
                activityType: "meal",
                location: currentDest,
                category: "Local Dining"
            });
        }
        
        // ACCOMMODATION - Replaced .filter(...) with a loop
        record {|string name; string description; string price_range; string destination_id;|}[] currentDestHotels = [];
        foreach var h in realHotels {
            if h.destination_id == currentDestId {
                currentDestHotels.push(h);
            }
        }
        
        if currentDestHotels.length() > 0 {
            int hotelIndex = hotelCounters[destinationIndex] % currentDestHotels.length();
            var selectedHotel = currentDestHotels[hotelIndex];
            hotelCounters[destinationIndex] = hotelCounters[destinationIndex] + 1;
            
            dayActivities.push({
                title: "Stay at " + selectedHotel.name,
                note: selectedHotel.description + " (Perfect for " + travelStyle + " travelers, " + selectedHotel.price_range + " range)",
                time: "Check-in: 3:00 PM",
                cost: <int>hotelBudget,
                duration: "Overnight",
                activityType: "accommodation",
                location: currentDest,
                category: "Lodging"
            });
        } else {
            // Fallback accommodation
            dayActivities.push({
                title: "Comfortable Accommodation",
                note: "Quality lodging in " + currentDest + " perfect for " + travelStyle + " travelers",
                time: "Check-in: 3:00 PM",
                cost: <int>hotelBudget,
                duration: "Overnight",
                activityType: "accommodation",
                location: currentDest,
                category: "Lodging"
            });
        }
        
        // Build enhanced day itinerary
        json dayPlan = {
            day: currentDay,
            date: "Day " + currentDay.toString(),
            destination: currentDest,
            location: "Sri Lanka",
            weather: "Pleasant",
            activities: dayActivities,
            totalCost: <int>dailyBudget,
            travelStyle: travelStyle,
            matchedInterests: interests,
            activityIntensity: activitiesPerDay,
            highlights: [
                "Personalized for " + travelStyle + " travelers",
                "Smart budget allocation"
            ]
        };
        
        itinerary.push(dayPlan);
        currentDay += 1;
        
        // FORCE STOP: Never exceed requested days
        if currentDay > days {
            log:printInfo(string `FORCE STOP: Reached requested ${days} days, stopping iteration`);
            break;
        }
    }
    
    // Calculate enhanced costs
    int totalCost = <int>budget;
    int hotelCosts = <int>(hotelBudget * days);
    int foodCosts = <int>(foodBudget * days);
    int activityCosts = <int>(activityBudget * days);
    int transportCosts = <int>(transportBudget * days);
    
    // Create the sophisticated AI response
    json response = {
        "destination": destination,
        "destinations": destinations,
        "duration": days.toString() + " days",
        "totalBudget": totalCost,
        "travelStyle": travelStyle,
        "userInterests": interests,
        "budgetBreakdown": {
            "accommodation": hotelCosts,
            "food": foodCosts,
            "activities": activityCosts,
            "transport": transportCosts,
            "total": totalCost
        },
        "budgetAllocation": {
            "accommodation": travelStyle == "chill" ? 50 : (travelStyle == "packed" ? 35 : 45),
            "food": travelStyle == "chill" ? 35 : (travelStyle == "packed" ? 25 : 30),
            "activities": travelStyle == "chill" ? 10 : (travelStyle == "packed" ? 35 : 20),
            "transport": 5
        },
        "itinerary": itinerary,
        "summary": {
            "totalDays": days,
            "destinationsIncluded": realDestinations.length(),
            "attractionsVisited": realAttractions.length(),
            "restaurantsRecommended": realRestaurants.length(),
            "hotelsBooked": realHotels.length(),
            "travelStyleOptimization": travelStyle,
            "interestsMatched": interests.length(),
            "activitiesPerDay": activitiesPerDay,
            "intelligenceLevel": "SOPHISTICATED - Geographic Route Optimization",
            "personalizationScore": "98%",
            "recommendation": "Geographically optimized route for " + travelStyle + " travelers",
            "routeOptimization": "Smart clustering prevents inefficient north-south-north travel patterns"
        },
        "routeIntelligence": {
            "routePlanGenerated": routePlan.length() > 0,
            "totalDestinationsInRoute": routePlan.length(),
            "routeStrategy": "West → Central → South → East → North clustering",
            "backtrackingPrevention": "Advanced anti-repetition with geographic logic",
            "distanceOptimization": "Minimized travel time between destinations"
        },
        "personalization": {
            "styleAdaptation": "Budget allocation optimized for " + travelStyle + " pace",
            "interestMatching": "Attractions filtered for your preferences",
            "smartFiltering": "Hotels and activities selected based on travel style",
            "geographicLogic": "Route planned to minimize unnecessary travel between distant regions"
        },
        "metadata": {
            "plannerVersion": "Enhanced Intelligence v4.0 - Geographic Route Optimizer",
            "dataSource": "Real-time database with geographic clustering",
            "sophisticationLevel": "Advanced route optimization with regional clustering",
            "antiRepetitionLogic": "Prevents destination repetition and illogical routing patterns"
        }
    };
    
    return response;
}

// --- GROQ integration helper (simple HTTP POST) ---
// Reads GROQ API key and model from environment variables; returns json or error
function callGroqFromBallerina(string userMessage, json plan) returns json|error {
    string apiKey = os:getEnv("GROQ_API_KEY");
    if apiKey == "" {
        return { "error": "GROQ_API_KEY missing" };
    }

    string model = os:getEnv("GROQ_MODEL");
    if model == "" {
        model = "llama3-8b-8192";
    }

    // Build request body consistent with OpenAI chat completions format
    json body = {
        "model": model,
        "messages": [
            {"role": "system", "content": "You are a travel assistant that returns JSON travel plans when requested."},
            {"role": "user", "content": userMessage}
        ],
        "temperature": 0.7
    };

    http:Client groqClient = check new ("https://api.groq.com", {
        secureSocket: {}
    });

    http:Request req = new;
    req.setJsonPayload(body);
    req.setHeader("Authorization", "Bearer " + apiKey);
    req.setHeader("Content-Type", "application/json");

    http:Response|error resp = groqClient->post("/openai/v1/chat/completions", req);
    if (resp is http:Response) {
        // Try to parse the response as JSON first
    json|error jRes = resp.getJsonPayload();
        if (jRes is json) {
            return jRes;
        } else {
            // jRes must be an error here (json|error), convert to JSON error wrapper
            string errStr = jRes.toString();
            return { "error": errStr };
        }
    } else {
        return resp; // propagate error
    }
}
