To test this service please follow these steps:
1. generate the mock data that it will require to run
    - npm run create-mocks
    - feel free to alter the package.json's scripts to be any number of mock entries, it is 10000 by default
        - "create-mocks": "node generateMockJSON.js 1000000" 
2. start up the server
    - npm run serve
3. make a get request with the correct query parameters to the localhost
    - http://localhost:8080/matchmaking?userId=user9315&matchType=solo
    - userId=userIdx, required, where x is any number less than n, where n is the number provided during the create of the mock data
    - matchType=x, optional, where x is one of 5 strings: 'solo' | 'party' | 'team' | 'rankedSolo' | 'rankedParty'
4. view your response
    - if you provided a matchType, then your response will be an object containing the userId and userData of a matched player to the userId in the query parameter
    - if you did not provide a matchType, then your response will be an object containing the userId and userData of the userId in the query parameter