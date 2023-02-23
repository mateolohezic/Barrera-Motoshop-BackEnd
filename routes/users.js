const express = require('express');
const route = express.Router();
const { crearUser, getUser, deleteUser, getUserEspecifico, estadoUser, loginUser, agregarFavoritos, emailUser, restablecerContraseña } = require('../controllers/users');
const { jwtValidator } = require('../middleware/jwt');
const { body } = require('express-validator');


route.get('/obtener-users', getUser);

route.get('/:id', getUserEspecifico);

route.post('/crear-user', 
body('name').trim().escape().isAlpha('es-ES', {ignore: ' '}).not().isEmpty().isLength({min: 1, max: 50}).withMessage('Campo invalido'),
body('surname').trim().escape().isAlpha('es-ES', {ignore: ' '}).not().isEmpty().isLength({min: 1, max: 50}).withMessage('Campo invalido'),
body('email').trim().escape().isEmail().not().isEmpty().isLength({min: 1, max: 50}).withMessage('Campo invalido'),
body('password').trim().escape().not().isEmpty().isLength({min: 4, max: 25}).withMessage('Campo invalido'),
body('address').trim().escape().not().isEmpty().isLength({min: 1, max: 100}).withMessage('Campo invalido'),
body('province').trim().escape().not().isEmpty().isLength({min: 1, max: 50}).withMessage('Campo invalido'),
body('cp').trim().escape().not().isEmpty().isLength({min: 1, max: 50}).withMessage('Campo invalido'),
crearUser)

route.patch(`/estado-user`, jwtValidator, estadoUser);

route.patch(`/agregar-favorito`, agregarFavoritos);

route.delete(`/eliminar-user`, jwtValidator, deleteUser);

route.post(`/login-user`,
body('email').trim().escape().isEmail().not().isEmpty().isLength({min: 1, max: 50}).withMessage('Campo invalido'),
body('password').trim().escape().not().isEmpty().isLength({min: 6, max: 25}).withMessage('Campo invalido'),
loginUser);

route.patch(`/restablecer-password`,
body('password').trim().escape().not().isEmpty().isLength({min: 6, max: 25}).withMessage('Campo invalido'),
restablecerContraseña);

route.post(`/restablecer-email`, emailUser)

module.exports = route;