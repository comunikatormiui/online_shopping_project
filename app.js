function getHTMLHead(title)
{
	return `
	<!DOCTYPE html>
			<html lang="en">
			<head>
			<meta charset="utf-8" />
			<meta name="viewport" content="width=device-width,initial-scale=1" />
			<title>${title}</title>
			<link rel="stylesheet" href="/contacts/static/style.css" />
			</head>
			<body>
	`;
}

function getHTMLTail()
{
	return `
		</body>
		</html>
	`;
}

var express = require('express');
var app = express();
var bodyParser = require ('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(require('body-parser').urlencoded());

app.get('/', function (req, res) {
   res.send(`
   		${getHTMLHead("New Contact")}
		<h2>Hello World</h2>
		${getHTMLTail()}
   	`);
})

var server = app.listen(3000, function () {
   var host = server.address().address
   var port = server.address().port
})