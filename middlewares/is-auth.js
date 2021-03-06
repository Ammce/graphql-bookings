import jwt from 'jsonwebtoken';
module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        req.isAuth = false;
        return next();
    }
    const token = authHeader.split(" ")[1];
    if (!token || token === "") {
        req.isAuth = false;
        return next();
    }
    let decoded;
    try {
        decoded = jwt.verify(token, 'volimeizinata');
    } catch (error) {
        req.isAuth = false;
        return next();
    }
    req.isAuth = true;
    req.userId = decoded.userId
    next()
}