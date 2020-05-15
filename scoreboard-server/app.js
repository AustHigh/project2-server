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
		time: row.time,
	};
}

app.get('/scoreboard', (request, response) => {
	const query = 'SELECT name, time, id FROM score WHERE is_deleted = 0 ORDER BY time DESC';
	const params =[];
	connection.query(query, params, (error, rows) => {
		response.send({
			ok: true,
			scoreboard: rows.map(rowToObject),
		});
	});
});

app.get('/scoreboard/:name/', (request, response) => {
	const query = 'SELECT name, time, id FROM score WHERE is_deleted = 0 AND name = ? ORDER BY time DESC';
	const params = [request.params.name];
	connection.query(query, params, (error, rows) => {
		response.send({
			ok: true,
			scoreboard: rows.map(rowToObject),
		});
	});
});

app.post('/scoreboard', (request, response) => {
	const query = 'INSERT INTO score(name, time) VALUES (?, ?)';
	const params = [request.body.name, request.body.time];
	connection.query(query, params, (error, result) => {
		response.send({
			ok: true,
			id: result.insertId,
		});
	});
});

app.patch('/scoreboard/:id', (request, response) => {
	const query = 'UPDATE score SET name = ?, time = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
	const params = [request.body.name, request.body.time, request.params.id];
	connection.query(query, params, (error, result) => {
		response.send({
			ok: true,
		});
	});
});

app.delete('/scoreboard/:id', (request, response) => {
	const query = 'UPDATE score SET is_deleted = 1, updated_at CURRENT_TIMESTAMP WHERE id = ?';
	const params = [request.params.id];
	connection.query(query, params, (error, result) => {
		response.send({
			ok: true,
		});
	});
});


const port = 5443;
app.listen(port, () => {
	console.log(`We're live on port ${port}!`);
});
