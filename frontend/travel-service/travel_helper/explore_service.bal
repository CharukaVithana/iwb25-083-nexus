import ballerina/http;
import ballerina/sql;
import ballerina/log;
import ballerina/regex;
// Uses dbClient from config.bal

type DestinationRow record {
    string id;
    string name;
    string? description;
    string? image_url;
    string? location;
    string? highlights;
};

type HotelRow record {
    string id;
    string name;
    string destination_id;
    string destination_name;
    decimal? rating;
    string? price_range;
    decimal? cost_per_night;
    string? amenities;
    decimal? latitude;
    decimal? longitude;
    string? description;
    string? image_url;
};
// Explore and Hotels APIs via Python helper
@http:ServiceConfig {
    cors: {
        allowOrigins: ["http://localhost:3000", "http://localhost:3001"],
        allowCredentials: true,
        allowHeaders: ["Content-Type", "Authorization"],
        allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    }
}
service / on httpListener {

    // List destinations
    resource function get destinations() returns json|error {
        return getDestinationsList();
    }

    // Destination by id
    resource function get destinations/[string id]() returns json|http:NotFound|error {
        return getDestinationById(id);
    }

    // Compatibility aliases for frontend expecting /regions
    resource function get regions() returns json|error {
        return getDestinationsList();
    }

    resource function get regions/[string id]() returns json|http:NotFound|error {
        return getDestinationById(id);
    }

    // List hotels
    resource function get hotels() returns json|error {
        stream<HotelRow, error?> s =
        dbClient->query(`SELECT h.id, h.name, h.destination_id, d.name AS destination_name, h.rating, h.price_range, h.cost_per_night, h.amenities, h.latitude, h.longitude, h.description, h.image_url 
                FROM hotels h JOIN destinations d ON h.destination_id = d.id ORDER BY h.rating DESC`);
        return collectHotels(s);
    }

    // Hotels by destination
    resource function get hotels/[string destinationId]() returns json|error {
        stream<HotelRow, error?> s =
        dbClient->query(`SELECT h.id, h.name, h.destination_id, d.name AS destination_name, h.rating, h.price_range, h.cost_per_night, h.amenities, h.latitude, h.longitude, h.description, h.image_url 
            FROM hotels h JOIN destinations d ON h.destination_id = d.id WHERE h.destination_id = ${destinationId} ORDER BY h.rating DESC`);
        return collectHotels(s);
    }

    // Hotels search with filters
    resource function get hotels/search(http:Request req) returns json|error {
        string destination = req.getQueryParamValue("destination") ?: "";
        string ratingS = req.getQueryParamValue("rating") ?: "";
        string amenities = req.getQueryParamValue("amenities") ?: "";
        string priceMinS = req.getQueryParamValue("priceMin") ?: "";
        string priceMaxS = req.getQueryParamValue("priceMax") ?: "";

    sql:ParameterizedQuery q = `SELECT h.id, h.name, h.destination_id, d.name AS destination_name, h.rating, h.price_range, h.cost_per_night, h.amenities, h.latitude, h.longitude, h.description, h.image_url 
            FROM hotels h JOIN destinations d ON h.destination_id = d.id WHERE 1=1`;
        if destination != "" {
            string like = string `%%${destination}%%`;
            q = sql:queryConcat(q, ` AND (d.name LIKE ${like} OR d.id = ${destination})`);
        }
        if ratingS != "" {
            float rating = check float:fromString(ratingS);
            q = sql:queryConcat(q, ` AND h.rating >= ${rating}`);
        }
        if priceMinS != "" {
            float pmin = check float:fromString(priceMinS);
            q = sql:queryConcat(q, ` AND IFNULL(h.cost_per_night, 0) >= ${pmin}`);
        }
        if priceMaxS != "" {
            float pmax = check float:fromString(priceMaxS);
            q = sql:queryConcat(q, ` AND IFNULL(h.cost_per_night, 0) <= ${pmax}`);
        }
        if amenities != "" {
            string[] ams = regex:split(amenities, ",");
            foreach var a in ams {
                string trimmed = a.trim();
                if trimmed.length() == 0 { continue; }
                string likeA = string `%%${trimmed}%%`;
                q = sql:queryConcat(q, ` AND h.amenities LIKE ${likeA}`);
            }
        }
        q = sql:queryConcat(q, ` ORDER BY h.rating DESC`);

        stream<HotelRow, error?> s = dbClient->query(q);
    return collectHotels(s);
    }
}

// Internal helpers
function getDestinationsList() returns json|error {
    stream<DestinationRow, error?> s =
        dbClient->query(`SELECT id, name, description, image_url, location, highlights FROM destinations ORDER BY name`);
    return collectDestinations(s);
}

function getDestinationById(string id) returns json|http:NotFound|error {
    stream<DestinationRow, error?> s =
        dbClient->query(`SELECT id, name, description, image_url, location, highlights FROM destinations WHERE id = ${id}`);
    json[] rows = check collectDestinations(s);
    if rows.length() == 0 { return http:NOT_FOUND; }
    return rows[0];
}

// Helpers to consume streams safely
function collectHotels(stream<HotelRow, error?> s) returns json[]|error {
    json[] out = [];
    while true {
        var r = s.next();
        if r is () { break; }
        if r is error {
            error? ce = s.close();
            if ce is error { log:printError("close hotels stream on error", ce); }
            return r;
        }
        // r is record {| HotelRow value; |}
        HotelRow vh = r.value;
        out.push({
            id: vh.id,
            name: vh.name,
            destination_id: vh.destination_id,
            destination_name: vh.destination_name,
            rating: vh.rating,
            price_range: vh.price_range,
            cost_per_night: vh.cost_per_night,
            amenities: vh.amenities,
            latitude: vh.latitude,
            longitude: vh.longitude,
            description: vh.description,
            image_url: vh.image_url
        });
    }
    error? c = s.close();
    if c is error { log:printError("close hotels stream", c); }
    return out;
}

function collectDestinations(stream<DestinationRow, error?> s) returns json[]|error {
    json[] out = [];
    while true {
        var r = s.next();
        if r is () { break; }
        if r is error {
            error? ce = s.close();
            if ce is error { log:printError("close destinations stream on error", ce); }
            return r;
        }
        DestinationRow vd = r.value;
        out.push({
            id: vd.id,
            name: vd.name,
            description: vd.description,
            image_url: vd.image_url,
            location: vd.location,
            highlights: vd.highlights
        });
    }
    error? c = s.close();
    if c is error { log:printError("close destinations stream", c); }
    return out;
}


