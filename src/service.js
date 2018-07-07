let path = '../mock-data/';
/**
 * a full production program would have a connection to a database here that looks over users currently
 * online and not currently engaged with another player in another lobby. The database would be organized
 * in a series of read-only buckets, each being small in size and dedicated to match type organizing users 
 * by their ratings. 
 * There would be a master database as well, the only that can be written to and updated with all users and 
 * their respective ratings being controlled from there, alterations to this bucket would cascade into the
 * smaller ones.
 * @param {string} matchType 
 */
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
/**
 * this function iterates over the bucket of data dedicated to the match type provided returning the closest
 * rating amongst the other users' data to the queried user's rating.
 * @param {string} userId 
 * @param {number} userMMKRating - the rating this user has on the match type provided
 * @param {object} relevantMatchData - the mock data portion relevant to the match type requested
 */
function findClosestMatch(userId, userMMKRating, relevantMatchData) {
    let relevantMatchDataArray = Array.from(Object.keys(relevantMatchData)).sort((a,b) => { return Number(a) - Number(b); });
    const origIndex = relevantMatchDataArray.indexOf(userMMKRating+'');
    let searchIndex = origIndex, 
        hiSearchIndex = origIndex + 1, 
        loSearchIndex = origIndex - 1;
    for(let i = 0; i < relevantMatchDataArray.length; i++) {
        const matchedUserIds = relevantMatchData[relevantMatchDataArray[searchIndex]];
        for(let j = 0; j < matchedUserIds.length; j++) {
            const randomUserIndex = Math.floor(Math.random() * Math.floor(matchedUserIds.length));
            const randomUserId = matchedUserIds[randomUserIndex];
            if(randomUserId !== userId) {
                console.info('Match found', randomUserId);
                return randomUserId;                
            } else if(matchedUserIds.length > 1) {
                return matchedUserIds[randomUserIndex + 1] || matchedUserIds[randomUserIndex - 1];
            }
        } 
        if(Math.abs(relevantMatchDataArray[searchIndex] - relevantMatchDataArray[loSearchIndex]) 
            < Math.abs(relevantMatchDataArray[searchIndex] - relevantMatchDataArray[hiSearchIndex])) {
                searchIndex = loSearchIndex--;
        } else {
            searchIndex = hiSearchIndex++;
        }          
    }
    throw new Error({ msg: 'Server error: Match not found' });
}
/**
 * this is the main exported function of the service, it makes use of the helper functions above to choose the 
 * correct portion of our mock data to 'connect to' and find the closest match on only that relevant data 
 * @param {string} userId 
 * @param {string} matchType 
 * @param {boolean} testing - is not something that would exist on this method in production, because the only 
 * mock we would need would be in the testing suite. For this proof of concept, both runtime and tests need their 
 * own mocks. This parameter alternates between them.
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