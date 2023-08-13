const jwt = require("jsonwebtoken");
const Admin = require("../model/adminSchema"); // Make sure to import the correct Admin schema

const AuthenticateAdmin = async (req, res, next) => {
    try {
        const token = req.cookies.adminToken; // Cookie name for admin token
        const verifyToken = jwt.verify(token, process.env.SECRET_KEY);

        const admin = await Admin.findOne({ _id: verifyToken._id, "tokens.token": token });

        if (!admin) {
            throw new Error('Admin not found');
        }

        req.token = token;
        req.admin = admin;
        req.adminID = admin._id;

        next();
    } catch (err) {
        res.status(401).send('Unauthorized: No token provided');
        console.log(err);
    }
};

module.exports = AuthenticateAdmin;
