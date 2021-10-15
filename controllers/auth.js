const {response} = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const {generateJWT} = require('../helpers/jwt');

const createUser = async(req, res = response) => {

    const {email, password} = req.body;

    try {
        
        let user = await User.findOne({email});
        
        if (user) {
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe un usuario con ese correo'
            });
        }
        
        user = new User(req.body);

        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password,  salt);

        await user.save();

        //Generar JWT
        const token = await generateJWT(user.id, user.name);
    
        return res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        });    

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hubo un error, por favor contacte al administrador'
        });
    }
};

const userLogin = async(req, res = response) => {

    const {email, password} = req.body;

    try {
        const user = await User.findOne({email});
        
        if (!user) {
            return res.status(400).json({
                ok: false,
                msg: 'Correo incorrecto'
            });
        }
        
        //Verificar password
        const validPassword = bcrypt.compareSync(password, user.password);

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña incorrecta'
            });
        }

        //Generar JWT
        const token = await generateJWT(user.id, user.name);

    
        return res.status(400).json({
            ok: true,
            uid:user.id,
            name: user.name,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hubo un error, por favor contacte al administrador'
        });
    }

};

const tokenRenew = async(req, res = response) => {

    const {uid, name} = req;

    const token = await generateJWT(uid, name);

    return res.json({
        ok: true,
        token
    });
};

module.exports = {
    createUser,
    userLogin,
    tokenRenew
}