const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

let credentials = JSON.parse(fs.readFileSync('credentials.json', 'utf8'));
let connection = mysql.createConnection(credentials);
connection.connect();

function rowToObject(row) {
	return {
		name: row.name,
		moves: row.moves,
	};
}

app.get('/scoreboard', (request, response) => {
	const query = 'SELECT name, moves, id FROM score WHERE is_deleted = 0 ORDER BY moves ASC';
	const params =[];
	connection.query(query, params, (error, rows) => {
		response.send({
			ok: true,
			scoreboard: rows.map(rowToObject),
		});
	});
});

app.get('/scoreboard/:name/', (request, response) => {
	const query = 'SELECT name, moves, id FROM score WHERE is_deleted = 0 AND name = ? ORDER BY moves ASC';
	const params = [request.params.name];
	connection.query(query, params, (error, rows) => {
		response.send({
			ok: true,
			scoreboard: rows.map(rowToObject),
		});
	});
});

app.post('/scoreboard', (request, response) => {
	const query = 'INSERT INTO score(name, moves) VALUES (?, ?)';
	const params = [request.body.name, request.body.moves];
	connection.query(query, params, (error, result) => {
		response.send({
			ok: true,
			id: result.insertId,
		});
		console.log(error);
	});
});








const port = 6443;
app.listen(port, () => {
	console.log(`We're live on port ${port}!`);
});
