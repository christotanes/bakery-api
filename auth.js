// [SECTION] JSON Web Token
import jwt from 'jsonwebtoken';
import 'dotenv/config'
// const jwt = require('jsonwebtoken');

// [SECTION] Secret Keyword
const secret = `${process.env.SECRECT_KEY}`;

// [SECTION] Token Creation
export function createAccessToken(user){
    const data = {
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin
    };
    return jwt.sign(data, secret, {});
};

export function verify (req, res, next) {
    let token = req.headers.authorization;

    if(typeof token == 'undefined'){
        return res.send({ auth: "Failed. No Token! False "});
    } else {
        token = token.slice(7, token.length);
        jwt.verify(token, secret, (err, decodedToken) => {
            if(err){
                return res.send({
                    auth: "Failed",
                    message: err.message + ' False'
                });
            } else {
                req.user = decodedToken
                next();
            };
        })
    };
};

export function verifyAdmin (req, res, next){
    if(req.user.isAdmin){
        next();
    } else {
        return res.status(403).json({
            auth: "Failed",
            message: "Action Forbidden! Requires admin privileges.",
        });
    };
};
export default createAccessToken