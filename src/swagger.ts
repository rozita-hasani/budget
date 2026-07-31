import swaggerJsdoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJsdoc({
    definition: {
        openapi: "3.0.0",
        info: {
            title: "SmartBudget API",
            version: "1.0.0",
            description: "Personal finance API",
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
            schemas: {
                Category: {
                    type: "object",
                    properties: {
                        id: { type: "string" },
                        name: { type: "string" },
                        color: { type: "string" },
                    },
                },
            },
        },
    },
    apis: ["./src/features/**/*.routes.ts"],
});