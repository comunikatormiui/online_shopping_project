var pg = require('pg');
var connectionString = 'postgres://ubuntu:ubuntu@localhost:5432/mydb';
pg.connect(connectionString, onConnect);

var express = require('express');
var app = express();
var bodyParser = require ('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(require('body-parser').urlencoded());

function onConnect(err, client, done) {
  	if (err) {
    	console.error(err);
    	process.exit(1);
  	}
	client.end();
}

app.get('/view/*', function(req, res)
{
	var tableData = '';
   	var counter = 0;
   	var client = new pg.Client(connectionString);
	client.connect();
  	var query = client.query("SELECT id, name FROM test_table ORDER BY id");
	query.on("row", function (row, result) {		// this method is called after each row is retrieved
		if(counter == 0)
		{
			tableData += '<ul>';
		}
		counter++;
		tableData += `<li>${row.name}</li>\n`;
	});
	query.on("end", function (result) {				// this method is called after database query is completed
	    client.end();
	    if(counter > 0){
	    	tableData += '</ul>';
	    }
	    res.send(`
	   		${getHTMLHead("Contact List")}
			<h3>Output List</h3>
			${tableData}
			${getHTMLTail()}
	   	`);
	});
})

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