const jwt = require('jsonwebtoken');
require('dotenv').config();
const claveToken = process.env.CLAVE;

const jwtValidator = async (req,res, next) => {
    const { accessToken } = req.body;

    try {
        const verify = jwt.verify(accessToken, claveToken);
        if (verify) {
            return next()
        }
    } catch (error) {
        res.status(403).send("Sin permisos.");
    }
}

module.exports = { jwtValidator }