import pkg from 'chai';
import 'chai-http';
import { DiscoveryStubClient } from '../client/discovery-stub-client.js';
import { DiscoveryStubService } from '../service/discovery-stub-service.js';
const { expect } = pkg;
import faker from "faker";
import sinon from "sinon";
import { source1Response } from '../mocks.js';

describe('Discovery stub Service', () => {

    let service = new DiscoveryStubService(new DiscoveryStubClient());

    let stubValue: any = [{
        slices: [
            {
                origin_name: faker.name.findName(),
                destination_name: faker.name.findName(),
                duration: faker.random.number(),
                flight_number: faker.random.alphaNumeric(),
                departure_date_time_utc: faker.date.future().toUTCString(),
                arrival_date_time_utc: faker.date.future().toUTCString()
            },
            {
                origin_name: faker.name.findName(),
                destination_name: faker.name.findName(),
                duration: faker.random.number(),
                flight_number: faker.random.alphaNumeric(),
                departure_date_time_utc: faker.date.future().toUTCString(),
                arrival_date_time_utc: faker.date.future().toUTCString()
            }
        ],
        price: faker.random.number()
    }];

    it("Return the value of source", async () => {
        const stub = sinon.stub(service, "getFlightRoutes").returns(stubValue);
        const flights = await service.getFlightRoutes();
        expect(stub.calledOnce).to.be.true;
        expect(flights[0].slices[0].flight_number).to.equal(stubValue[0].slices[0].flight_number);
    })

    it("return flight routes with non duplicate values", () => {
        let result = service.filterDuplicates(source1Response.concat(source1Response));
        expect(result.length).to.equals(source1Response.length);
    })
})