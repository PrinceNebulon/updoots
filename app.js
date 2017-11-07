const bodyParser = require('body-parser');
const express = require('express');
const exphbs  = require('express-handlebars');
const moment = require('moment');

const db = require('./models');


// Create express app
const app = express();
// parse application/json
app.use(bodyParser.json());

// Set handlebars engine
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');



/* HTML routes */
app.get('/', (req, res) => {
	db.doot.findAll({raw: true})
		.then((doots) => {
			for (let i=0; i<doots.length; i++) {
				doots[i].updatedDate = moment(doots[i].updatedAt).format('dddd, MMMM Do YYYY');
			}
			res.render('home', { doots: doots });
		});
});

app.get('/doot', (req, res) => {
	res.render('doot');
});



/* API routes */
app.get('/api/doots', (req, res) => {
	db.doot.findAll({raw: true})
		.then((doots) => {
			res.json(doots);
		});
});

app.post('/api/doots', (req, res) => {
	db.doot.create({
		title: req.body.title,
		body: req.body.body,
		author: req.body.author
	})
		.then((doot) => {
			res.json(doot);
		});
});

app.get('/api/doots/:id', (req, res) => {
	db.doot.findOne({
		where: {
			id: req.params.id
		}
	})
		.then((doot) => {
			res.json(doot);
		});
});

app.patch('/api/doots/:id', (req, res) => {
	var body = {};

	if (req.body.title && req.body.title != '')
		body.title = req.body.title;
	if (req.body.body && req.body.body != '')
		body.body = req.body.body;
	if (req.body.author && req.body.author != '')
		body.author = req.body.author;

	db.doot.update(
		body,
		{ where: { id: req.params.id } })
		.then(() => {
			return db.doot.findOne({ where: { id: req.params.id } });
		})
		.then((doot) => {
			res.json(doot);
		});
});

app.delete('/api/doots/:id', (req, res) => {
	db.doot.destroy({
		where: {
			id: req.params.id
		}
	})
		.then(() => {
			res.sendStatus(204);
		});
});

app.post('/api/doots/:id/vote/up', (req, res) => {
	vote(true, req, res);
});

app.post('/api/doots/:id/vote/down', (req, res) => {
	vote(false, req, res);
});

function vote(add, req, res) {
	var body = {};
	if (add === true) {
		body = { upDoots: db.sequelize.literal('upDoots + 1') };
	} else {
		body = { downDoots: db.sequelize.literal('downDoots + 1') };
	}

	db.doot.update(
		body,
		{ where: { id: req.params.id } })
		.then(() => {
			return db.doot.findOne({ where: { id: req.params.id } });
		})
		.then((doot) => {
			res.json(doot);
		});
}



// Sync DB and start web server
db.sequelize.sync()
	.then(() => {
		app.listen(8080, () => {
			console.log('Example app listening on port 8080!');
		});
	});