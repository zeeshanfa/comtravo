import { FlightSearchResponse } from "../models/flightSearchResponse.js";
import axios from 'axios';
import { config } from '../configuration.js';

export class DiscoveryStubClient {

    //Gets Flight route from source1
    getFlightSource1() {
        return this.getFlightSource(config.path1);
    }
    //Gets Flight route from source2
    getFlightSource2() {
        return this.getFlightSource(config.path2);
    }
    private getFlightSource(source: string) {
        const url = config.host + source;
        const username = process.env.USERNAME || '';
        const password =  process.env.PASSWORD || '';

        return axios({
            method: 'get',
            headers: {
                "content-type": "application/json"
            },
            url,
            auth: {
                username: username,
                password: password
            },
        })
            .then((response: any) => {
                console.debug('SUCCESS')
                return response.data as FlightSearchResponse;
            })
            .catch(function (error: any) {
                if (error.response.status == 503)
                    return null; //return null if the service is unavailable
                else {
                    throw new Error();
                }
            });
    }

}