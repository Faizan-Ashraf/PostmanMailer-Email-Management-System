import jwt from "jsonwebtoken";

const jwtAuthMiddleware = (req,res,next)=>{
    const authorization = req.headers.authorization;
    if (!authorization) {
        return res.status(401).json({error: 'Token Not Found!'});
    }
    const token = authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({error: 'Unauthorized!'});

    }

    try {
        const decoded = jwt.verify(token,'1234');
        req.user = decoded;
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({error: 'Invalid Token!'});
    }
}

const generateToken = (userData) =>{
    return jwt.sign(userData, '1234',{expiresIn: '30m'});
}

export default {jwtAuthMiddleware, generateToken};