import pkg from 'chai';
import { DiscoveryStubClient } from '../client/discovery-stub-client.js';
const { expect } = pkg;
import moxios from 'moxios';

describe('Discovery stub Client', () => {
    beforeEach(function () {
        moxios.install()
    });

    afterEach(function () {
        moxios.uninstall()
    });

    it('verify that the url should be used correctly', async () => {
        let client = new DiscoveryStubClient();

        moxios.stubRequest('https://discovery-stub.comtravo.com/source1', {
            status: 200,
            response: {
                flights: []
            }
        });

        await client.getFlightSource1();

        expect(moxios.requests.mostRecent().url).to.equal('https://discovery-stub.comtravo.com/source1');
    });

    it('make sure error is handled correctly', async () => {
        let client = new DiscoveryStubClient();

        moxios.stubRequest('https://discovery-stub.comtravo.com/source1', {
            status: 503,
            response: 'Service Unavailable'
        });

        const result = await client.getFlightSource1();

        expect(moxios.requests.mostRecent().url).to.equal('https://discovery-stub.comtravo.com/source1');
        expect(result).to.equal(null);
    });
});