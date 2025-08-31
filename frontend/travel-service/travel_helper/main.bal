import ballerina/io;
// no external imports needed

public function main() {
    // Port is configured in listener.bal as configurable HTTP_PORT
    // We can't reference it directly here; just print common URLs with default 9090 or 9091 per Config.toml
    int port = 9091;
    io:println("Travel Helper AI Service is starting...");
    io:println(string `Service will be available at: http://localhost:${port}/travelhelper`);
    io:println(string `Explore/Hotels at: http://localhost:${port}/`);
    io:println(string `AI endpoint: http://localhost:${port}/travelhelper/plans/ai`);
}
