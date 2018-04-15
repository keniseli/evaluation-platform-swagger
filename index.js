const express = require('express');
const basicAuth = require('express-basic-auth');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const app = express();
const env = process.env.NODE_ENV || 'development';

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.use(basicAuth({
	users: { 'admin': 'alles' },
	challenge: true,
}));

let swaggerDocument = YAML.load('./swagger.yaml');

if (env !== 'production') {
	swaggerDocument = Object.assign({}, swaggerDocument, {
		host: 'localhost:3000',
		schemes: ['http'],
	});
}

app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(app.get('port'), function () {
	console.log("Node app is running at localhost:" + app.get('port'));
	console.log("Node env is set to " + env);
});
