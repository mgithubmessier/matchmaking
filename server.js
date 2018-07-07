let express = require('express');
let cors = require('cors');
let bodyParser = require('body-parser');
let app = express();

let corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors(corsOptions));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:4200");    
  res.header("Access-Control-Allow-Headers", "http://localhost:4200");
  next();
});

require('./src/routes.js')(app);

app.listen(8080);
