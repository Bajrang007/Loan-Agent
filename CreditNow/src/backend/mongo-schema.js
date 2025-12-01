// Switch to the database (if running in shell, otherwise connection defines DB)
// use loan_system;

// Create audit_logs collection with validation
db.createCollection("audit_logs", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["userId", "action", "timestamp"],
            properties: {
                userId: {
                    bsonType: "int",
                    description: "ID of the user performing the action (matches MySQL ID)"
                },
                action: {
                    bsonType: "string",
                    description: "Action name (e.g., 'LOGIN', 'VIEW_LOAN')"
                },
                details: {
                    bsonType: "object",
                    description: "Flexible object for storing action details"
                },
                ipAddress: {
                    bsonType: "string",
                    description: "IP address of the user"
                },
                timestamp: {
                    bsonType: "date",
                    description: "Time of the action"
                }
            }
        }
    }
});

// Create Indexes
db.audit_logs.createIndex({ "userId": 1 });
db.audit_logs.createIndex({ "action": 1 });
db.audit_logs.createIndex({ "timestamp": -1 }); // Descending for latest logs
