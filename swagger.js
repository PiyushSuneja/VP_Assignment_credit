const swaggerJSDoc = require('swagger-jsdoc');
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            description:
                'service to manage credit balace of user',
            version: '1.0.0',
            title: 'CREDIT_SYSTEM',
        },
        host: 'localhost:9100',
        basePath: '',
        servers: [
            {
                url: 'http://localhost:9100/api',
                description: 'url to connect at localhost',
            },
        ],
        schemes: ['http'],
    },
    apis: ['./src/lib/routes/index.js'],
    // apis: combinedSwaggerSpecs
};

const specs = swaggerJSDoc(options);

module.exports = specs;
