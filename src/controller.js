let service = require('./service.js');
module.exports = function(app){
    app.get('/matchmaking', function(req, res){
        if(!req.query.userId) {
            throw new Error({ msg: 'userId not provided' });
        }
        res.json(service(req.query.userId, req.query.matchType));
    });
}