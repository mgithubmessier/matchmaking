module.exports = function(app){
    require('./controller.js')(app);
    // in a larger server with more controllers, they would be included here
}