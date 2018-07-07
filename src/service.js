let mockUserData = require('../mock-data/mock-userdata');
function getRelevantMatchData(matchType) {
    if (matchType === 'solo') {
        return require('../mock-data/mock-solo-tier.json');
    } else if (matchType === 'party') {
        return require('../mock-data/mock-party-tier.json');
    } else if (matchType === 'team') {
        return require('../mock-data/mock-team-tier.json');
    } else if (matchType === 'rankedSolo') {
        return require('../mock-data/mock-ranked-solo-tier.json');
    } else if (matchType === 'rankedParty') {
        return require('../mock-data/mock-ranked-party-tier.json');        
    }
    throw new Error('Invalid match type provided: ' + matchType);
}
function findClosestMatch(userId, userMMKRating, relevantMatchData) {
    let mmkOffset = 0;
    while(relevantMatchData[userMMKRating + mmkOffset]) {
        const matchedUserIds = relevantMatchData[userMMKRating + mmkOffset];
        for(let i = 0; i < matchedUserIds.length; i++) {
            const randomUserIndex = Math.floor(Math.random() * Math.floor(matchedUserIds.length)); 
            const randomUserId = matchedUserIds[randomUserIndex]           
            if(randomUserId !== userId) {
                console.info('Match found', randomUserId);
                return randomUserId;
            }
        }
        mmkOffset = mmkOffset >= 0 ? -(mmkOffset + 1) : -mmkOffset;
    }
    throw new Error('Server error: Match not found');
}
module.exports = function(userId, matchType) {
    if(!mockUserData[userId]) {
        throw new Error('Nonexistant userId: ' + userId);
    } else {
        const userData = mockUserData[userId];
        if(!matchType) {
            console.info('Getting userData for userId: ' + userId);
            return userData;
        }        
        console.info('Finding match for userId: ' + userId + ' on matchType: ' + matchType);
        const relevantMatchData = getRelevantMatchData(matchType);
        const userMMKRating = userData[matchType];
        const matchedUserId = findClosestMatch(userId, userMMKRating, relevantMatchData);
        return { userId: matchedUserId, userData: mockUserData[matchedUserId] };
    }
}