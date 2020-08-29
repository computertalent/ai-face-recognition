const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

const db = require('knex')({
  client: 'pg',
  connection: {
  	connectionString: process.env.DATABASE_URL,
  	ssl: true,
  }
});

const register = require('./controllers/register')
const signin = require('./controllers/signin')
const profile = require('./controllers/profile')
const image = require('./controllers/image')

const app = express();

app.use(cors());

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.get('/', (req, res) =>{ res.send("it is working!"); })
app.post('/signin', (req, res) => { signin.handleSignIn(req, res, db, bcrypt) });
app.post('/register', (req, res) =>{ register.handleRegister(req, res, db, bcrypt) });	
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) });
app.put('/image', (req, res) => { image.handleImage(req, res, db) });
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res)})


 app.listen((process.env.PORT || 3000), ()=> {
 	console.log(`Server listening on port ${process.env.PORT}`);
 });



