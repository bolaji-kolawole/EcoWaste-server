
import * as dotenv from "dotenv"; dotenv.config();

import fastify from 'fastify';
import logger from './config/LoggerImpl';
import database from './config/DatabaseConfig';
import { Setup } from './config/Setup';

const server = fastify({ maxParamLength: 1000, ajv: { customOptions: { allErrors: true } } });

// Move cors configuation into barmoury
server.addHook('preHandler', (req, res, done) => {

    // example logic for conditionally adding headers
    //const allowedPaths = ["/some", "/list", "/of", "/paths"];
    //if (allowedPaths.includes(req.routerPath)) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Max-Age", 1728000);
    res.header("Access-Control-Allow-Credentials", true);
    //}

    const isPreflight = /options/i.test(req.method);
    if (isPreflight) {
        return res.send();
    }

    done();
})
// end dirty cors config

Setup.configure(server);
database.connected().then(connected => {
    if (!connected) {
        process.exit(1);
    }
    server.listen({ host: "::", port: process.env.PORT }, (err, address) => {
        if (err) logger.error(err) && process.exit(1);
        logger.info(`[ecowaste_server] server running at http://localhost:${process.env.PORT} - ${address}`);
    })
});
