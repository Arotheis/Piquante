const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();


const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

// Connexion à la base de données avec mongoose
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	.then(() => console.log('Connexion à MongoDB réussie !'))
	.catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();
app.use(helmet.crossOriginResourcePolicy({
	policy: 'cross-origin'
}))

// Définition de headers pour éviters les erreurs de CORS
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
	next();
});

app.use(bodyParser.json());

// Enregistrement des routeurs
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;