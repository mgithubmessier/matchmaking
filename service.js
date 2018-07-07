let mockUserData = require('./mock-data/mock-userdata');
function getRelevantMatchData(matchType) {
    if (matchType === 'solo') {
        return require('./mock-data/mock-solo-tier.json');
    } else if (matchType === 'party') {
        return require('./mock-data/mock-party-tier.json');
    } else if (matchType === 'team') {
        return require('./mock-data/mock-team-tier.json');
    } else if (matchType === 'rankedSolo') {
        return require('./mock-data/mock-ranked-solo-tier.json');
    } else if (matchType === 'rankedParty') {
        return require('./mock-data/mock-ranked-party-tier.json');        
    }
    throw new Error('Invalid match type provided: ' + matchType);
}
function findClosestMatch(userId, userMMKRating, relevantMatchData) {
    let mmkOffset = 0;
    let matchedUserId = undefined;
    while(!matchedUserId && relevantMatchData[userMMKRating + mmkOffset]) {
        relevantMatchData[userMMKRating + mmkOffset].forEach((potentialMatchedUserId) => {
            if(potentialMatchedUserId !== userId) {
                matchedUserId = potentialMatchedUserId;
            }
        });
        mmkOffset = mmkOffset >= 0 ? -(mmkOffset + 1) : -mmkOffset;
    }
    console.log(matchedUserId);
    if(matchedUserId) {
        return matchedUserId;
    }
    throw new Error('Server error: Match not found');
}
module.exports = function(userId, matchType) {
    console.log(userId, matchType);
    if(!mockUserData[userId]) {
        throw new Error('Nonexistant userId: ' + userId);
    } else {
        const userData = mockUserData[userId];
        const relevantMatchData = getRelevantMatchData(matchType);
        const userMMKRating = userData[matchType];
        return findClosestMatch(userId, userMMKRating, relevantMatchData);
    }
}