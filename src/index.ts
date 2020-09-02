import { DiscoveryStubService } from "./service/discovery-stub-service.js";
import { DiscoveryStubClient } from "./client/discovery-stub-client.js";
import express from 'express';
import { config } from './configuration.js';

let app = express();
let counter: number = 1;

app.get(config.Options.path, (req, res, next) => {
    console.log("Request id: ", counter++);
    let discoveryStubService = new DiscoveryStubService(new DiscoveryStubClient());

    let timeoutPromise = new Promise<never>((resolve, reject) => setTimeout(() => reject({ message: 'Request Timeout' }), config.timeout));

    let flights = discoveryStubService.getFlightRoutes();

    let promisedValue = Promise.race([timeoutPromise, flights]);

    promisedValue.then(flightRoutes => {
        return res.send(JSON.stringify(flightRoutes));
    }).catch(next);
});

app.use(function (err: any, req: any, res: any, next: any) {
    console.debug('Error occurred: ', err.message)
    if (res.headersSent) {
        console.debug('Headers are already sent')
        return next(err)
    }
    res.status(500).send(err.message);
});

app.listen(config.Options.port, () =>
    console.log("Server running on port :" + config.Options.port)
);


