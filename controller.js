let service = require('./service.js');
module.exports = function(app){
    app.get('/matchmaking', function(req, res){
        if(!req.query.userId) {
            throw new Error('userId not provided');
        }
        if(!req.query.matchType) {
            throw new Error('matchType not provided');
        }
        res.json({ userId: service(req.query.userId, req.query.matchType) });
    });
}