const User = require('../model/users');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const claveToken = process.env.CLAVE;
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

const getUser = async (req, res) => {
    const users = await User.find({})
    res.status(200).send(users);
}

const getUserEspecifico = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id)
    res.status(200).send(user);
}

const crearUser = async (req, res) => {
    const { name, surname, email, password, address, province, cp} = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userExistente = await User.findOne({"email": email})

    if (!userExistente){
    const saltRound = 15; 
    const passwordEncripted = bcrypt.hashSync(password, saltRound);
    const status = "activo";
    const rol = "user";
    const nuevoUser = new User({
        name,
        surname,
        email,
        password: passwordEncripted,
        address,
        province,
        cp,
        status,
        rol,
        favorites: []
    })
    await nuevoUser.save()
    res.status(200).send(`Se creo el usuario con éxito.`)
    } else {
    res.status(206).send(`Email en uso.`)
    }
}

const deleteUser = async (req, res) => {
    const { id } = req.body
    await User.findByIdAndDelete(id);
    res.status(200).send(`Se elimino el usuario con éxito.`)
}

const estadoUser = async (req, res) => {
    const { id, status  } = req.body
    await User.findByIdAndUpdate(id, {
        status
    })
    res.status(200).send(`Se actualizo el usuario con éxito.`)
};

const agregarFavoritos = async (req, res) => {
    const { id, favorites  } = req.body
    await User.findByIdAndUpdate(id, {
        favorites
    })
    res.status(200).send(`Se actualizo el usuario con éxito.`)
};

const loginUser = async (req, res) => {
    const { email, password } = req.body

    try{
        const user = await User.findOne({"email": email})
        if (user && user.status === "activo") {
            if (bcrypt.compareSync(password, user.password)) {
                const token = jwt.sign({user}, claveToken , { expiresIn : "1h"})
                res.status(200).json({user,token})
              } else {
                res.status(206).send({message : 'Contraseña incorrecta'})
              }
            } else {
              res.status(206).send({message : 'Email inexistente'})
        }
    }
    catch(error){
        console.error(error);
    }
};

const emailUser = async (req, res) => {
    const { email } = req.body

    try{
        const user = await User.findOne({"email": email})
        if (user) {
                res.status(200).send(user)
            } else {
                res.status(206).send({message : 'Usuario no encontrado'})
        }
    }
    catch(error){
        console.error(error);
    }
};

const restablecerContraseña = async (req, res) => {
    
    const { id, password  } = req.body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const saltRound = 15; 
    const passwordEncripted = bcrypt.hashSync(password, saltRound);
    await User.findByIdAndUpdate(id, {
        password: passwordEncripted
    })
    res.status(200).send(`Se actualizo la contraseña con éxito.`)
};

module.exports = { crearUser, getUser, deleteUser, getUserEspecifico, estadoUser, loginUser, agregarFavoritos, emailUser, restablecerContraseña }