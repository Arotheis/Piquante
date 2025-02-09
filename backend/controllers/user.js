const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

// Création de nouveaux utilisateurs
exports.signup = (req, res, next) => {
    // Hash du mot de passe avec bcrypt
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        // Masquer l'email
        const buff = new Buffer(req.body.email);
        const emailInbase = buff.toString('base64');

        // Création du nouvel utilisateur
        const user = new User({
            email: emailInbase,
            password: hash
        })
        // Sauvegarde dans la base de données
        user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !'}))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

// Connexion d'utilisateur enregistré
exports.login = (req, res, next) => {
    // Masquage de l'adresse mail
    const buff = new Buffer(req.body.email);
    const emailInbase = buff.toString('base64');

    // Recherche d'un utilisateur dans la base de données
    User.findOne({ email: emailInbase })
    .then(user => {
        // Utilisateur non trouvé
        if(!user) {
            return res.status(401).json({ error: 'Utilisateur non trouvé !'})
        }
        // Comparaison mot de passe de la requete avec celui de la base de données
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            if(!valid) {
                return res.status(401).json({ error: 'Mot de passe incorrect !'})
            }
            res.status(200).json({
                userId: user._id,
                // Création d'un token pour sécuriser le compte de l'utilisateur
                token: jwt.sign(
                    { userId: user._id },
                    'RANDOM_TOKEN_SECRET',
                    { expiresIn: '24h' }
                )
            });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};