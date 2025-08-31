import ballerinax/mysql;

// MySQL configuration
configurable string USER = "root";
configurable string PASSWORD = "Pcd@24141";
configurable string HOST = "localhost";
configurable int PORT = 3306;
configurable string DATABASE = "travel_helper";

// MySQL client configuration
public final mysql:Client dbClient = check new (
    host = HOST,
    user = USER,
    password = PASSWORD,
    port = PORT,
    database = DATABASE
);
