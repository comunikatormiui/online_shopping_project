var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://ubuntu:ubuntu@localhost:5432/mydb';

var client = new pg.Client(connectionString);
client.connect();
var query = client.query('CREATE TABLE IF NOT EXISTS test_table(id SERIAL PRIMARY KEY, name varchar(30) NOT NULL);');

query.on('end', function() { 
	client.end(); 
});
