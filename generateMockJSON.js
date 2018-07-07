const fs = require('fs');
// accept arguments from command line or default to a high enough value for the distribution
const NUMBER_OF_ENTRIES = process.argv[2] ? process.argv[2] : 10000;

function getRandomInteger(maximumRandomInteger) {
    return Math.floor(Math.random() * Math.floor(maximumRandomInteger));
}
/**
 * generates a random mmk stat that fits into valve's distribution estimates
 * @see https://dota2.gamepedia.com/Matchmaking_Rating
 */
function generateMMKStat() {
    const randomIntUnder100 = getRandomInteger(100);
    if (randomIntUnder100 < 5)
        return getRandomInteger(1100);
    else if (randomIntUnder100 < 10)
        return getRandomInteger(1500);
    else if (randomIntUnder100 < 25)
        return getRandomInteger(2000);
    else if (randomIntUnder100 < 50)
        return getRandomInteger(2250);
    else if (randomIntUnder100 < 75)
        return getRandomInteger(2731);
    else if (randomIntUnder100 < 90)
        return getRandomInteger(3200);            
    else if (randomIntUnder100 < 95)
        return getRandomInteger(3900);
    else 
        return getRandomInteger(4100);
}

let userEntriesJSON = {};
let soloTierMap = {};
let partyTierMap = {};
let rankedSoloTierMap = {};
let rankedPartyTierMap = {};
let teamTierMap = {};

/** 
 * add a generated user into a mock data map that accounts for collisions on their mmkStat
 * this will allow for O(1) retrieval of a valid match
 * this simulates our database organization 
 * @param {object} map - contains arrays of userIds, bucketed by their mmkStat
 */
function addToMap(map, userId, mmkStat) {
    if (map[mmkStat]) {
        map[mmkStat].push(userId);
    } else {
        map[mmkStat] = [userId]
    }
    return mmkStat;
}

for (let i = 0; i < NUMBER_OF_ENTRIES; i++) {
    const mockUserId = 'user'+i;
    userEntriesJSON[mockUserId] = {
        solo: addToMap(soloTierMap, mockUserId, generateMMKStat()),
        party: addToMap(partyTierMap, mockUserId, generateMMKStat()),
        rankedSolo: addToMap(rankedSoloTierMap, mockUserId, generateMMKStat()),
        rankedParty: addToMap(rankedPartyTierMap, mockUserId, generateMMKStat()),
        team: addToMap(teamTierMap, mockUserId, generateMMKStat())
    }
}
fs.writeFile('./mock-data/mock-userdata.json', JSON.stringify(userEntriesJSON), 'utf8');
fs.writeFile('./mock-data/mock-solo-tier.json', JSON.stringify(soloTierMap), 'utf8');
fs.writeFile('./mock-data/mock-party-tier.json', JSON.stringify(partyTierMap), 'utf8');
fs.writeFile('./mock-data/mock-ranked-solo-tier.json', JSON.stringify(rankedSoloTierMap), 'utf8');
fs.writeFile('./mock-data/mock-ranked-party-tier.json', JSON.stringify(rankedPartyTierMap), 'utf8');
fs.writeFile('./mock-data/mock-team-tier.json', JSON.stringify(teamTierMap), 'utf8');
