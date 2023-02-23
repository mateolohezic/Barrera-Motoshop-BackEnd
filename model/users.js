const { Schema, model } = require('mongoose');

const user = new Schema({
    name: String,
    surname: String,
    email: String,
    password: String,
    address: String,
    province: String,
    cp: String,
    status: String,
    rol: String,
    favorites: Array,
})

module.exports = model (`User`, user)