import { DiscoveryStubClient } from "../client/discovery-stub-client.js";
import { Flight } from "../models/flight.js";
import { Slice } from "../models/slice.js";

export class DiscoveryStubService {

    constructor(private client: DiscoveryStubClient) { }

    async getFlightRoutes(): Promise<Flight[]> {

        const flightsResponseSource1Promise = this.client.getFlightSource1();
        const flightsResponseSource2Promise = this.client.getFlightSource2();
        const mergedRoutes: Flight[] = [];

        const sourceResponses = await Promise.all([flightsResponseSource1Promise, flightsResponseSource2Promise]);

        //if both responses from source 1 and source2 is empty throw error
        if (!sourceResponses[0] && !sourceResponses[1]) {
            throw new Error('Service Unavailable');
        }

        sourceResponses.forEach(item => {
            if (item != null) {
                mergedRoutes.push(...item.flights);
            }
        });
        return this.filterDuplicates(mergedRoutes);
    }

    //here we check for duplicates Slices based on flight_number, departure and arrival times
    // Slice is a combination of {berlin to stuttgart} and {stuttgart to berlin}
    // in the filter function v= Flight, i is index and a is Flight[]
    filterDuplicates(flights: Flight[]) {
        return flights.filter((v, i, a) => a.findIndex(t => this.isDuplicate(t, v)) === i);
    }

    private isDuplicate(flight1: Flight, flight2: Flight): boolean {
        return this.isFlightNumberSame(flight1.slices, flight2.slices)
            && this.isDepartureTimeSame(flight1.slices, flight2.slices)
            && this.isArrivalTimeSame(flight1.slices, flight2.slices)
    }

    private isFlightNumberSame(flight1Slices: Slice[], flight2Slices: Slice[]): boolean {
        return (flight1Slices[0].flight_number === flight2Slices[0].flight_number)
            && (flight1Slices[1].flight_number === flight2Slices[1].flight_number);
    }

    private isDepartureTimeSame(flight1Slices: Slice[], flight2Slices: Slice[]): boolean {
        return (flight1Slices[0].departure_date_time_utc === flight2Slices[0].departure_date_time_utc)
            && (flight1Slices[1].departure_date_time_utc === flight2Slices[1].departure_date_time_utc);
    }

    private isArrivalTimeSame(flight1Slices: Slice[], flight2Slices: Slice[]): boolean {
        return (flight1Slices[0].arrival_date_time_utc === flight2Slices[0].arrival_date_time_utc)
            && (flight1Slices[1].arrival_date_time_utc === flight2Slices[1].arrival_date_time_utc);
    }
}