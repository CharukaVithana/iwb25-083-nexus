import ballerina/http;

configurable int HTTP_PORT = 9091;

// Shared HTTP listener so we can host multiple services on the same port
public listener http:Listener httpListener = new (HTTP_PORT);
