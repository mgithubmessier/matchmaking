let path = '../mock-data/';
function getRelevantMatchData(matchType) {
    if (matchType === 'solo') {
        return require(path+'mock-solo-tier.json');
    } else if (matchType === 'party') {
        return require(path+'mock-party-tier.json');
    } else if (matchType === 'team') {
        return require(path+'mock-team-tier.json');
    } else if (matchType === 'rankedSolo') {
        return require(path+'mock-ranked-solo-tier.json');
    } else if (matchType === 'rankedParty') {
        return require(path+'mock-ranked-party-tier.json');        
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
    throw new Error({ msg: 'Server error: Match not found' });
}
/**
 * 
 * @param {*} userId 
 * @param {*} matchType 
 * @param {boolean} testing - is not something that would exist on this method in production, because the only mock we would need would be in the testing suite. For this proof of concept, both runtime and tests need their own mocks. This parameter alternates between them.
 */
module.exports = function(userId, matchType, testing) {
    if(testing) path = '../tests/test-data/'
    let mockUserData = require(path+'mock-userdata');
    if(!mockUserData[userId]) {
        throw new Error({ msg: 'Nonexistant userId: ' + userId });
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