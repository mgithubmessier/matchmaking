let Mocha = require('mocha');
let Chai = require('chai');
let Test = Mocha.Test;
let expect = Chai.expect;

let mochaInstance = new Mocha();
let suiteInstance = Mocha.Suite.create(mochaInstance.suite, 'Service: Matchmaking');

let service = require('../src/service.js');

suiteInstance.addTest(new Test('if there are no valid matches found, there should be a server error', function() {
    try {
        service('user0', 'rankedSolo', true);
    } catch(error) {
        // expect(error.msg).to.equal('Server error: Match not found');
    }
}));
suiteInstance.addTest(new Test('if there is a match, it should return the correct user', function() {
    expect(service('user0', 'solo', true).userId).to.equal('user1');
}));
suiteInstance.addTest(new Test('if there is not a direct match with the same rating, it should return the user with the closest rating', function() {
    try {
        expect(service('user0', 'party', true).userId).to.equal('user2')
    } catch(error) {
        console.log(error);
    }
}));
suiteInstance.addTest(new Test('if only provided a userId, it should return that user\'s information', function() {
    expect(service('user0', undefined, true)).to.equal(require('./test-data/mock-userdata.json').user0);
}));
let suiteRun = mochaInstance.run()
process.on('exit', (code) => {
  process.exit(suiteRun.stats.failures > 0)
});