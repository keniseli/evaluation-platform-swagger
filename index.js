const request = require('request');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const app = express();
const env = process.env.NODE_ENV || 'development';

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.use('/', swaggerUi.serve, (req, res, next) => {
	request.get('https://raw.githubusercontent.com/keniseli/evaluation-platform-swagger/master/swagger.yml', (error, response, body) => {
		if (error) {
			return res.status(500).send('Could not request swagger.yml.')
		}

		let swaggerDocument = YAML.parse(body);
		if (env !== 'production') {
			swaggerDocument = Object.assign({}, swaggerDocument, {
				host: 'localhost:3000',
				schemes: ['http'],
			});
		}
		return swaggerUi.setup(swaggerDocument)(req, res, next)
	});
});

app.listen(app.get('port'), function () {
	console.log("Node app is running at localhost:" + app.get('port'));
	console.log("Node env is set to " + env);
});
