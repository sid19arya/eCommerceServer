const Admin = require('../models/admin')
const jwt = require('jsonwebtoken')

function createAdmin(req, res){
    const {username, password} = req.body;

    if (!username || !password) {
        return res.status(418).send({message: "missing details"});
    }
    
    const newAdmin = new Admin({
        username: username,
        password: password
    })

    newAdmin.save().then(() => {
        return res.status(200).send({message: "Successfully created admin"})
    })
}

function readAdmin(req, res){
    const {username} = req.params;

    if (!username) {
        return res.status(418).send({message: "missing details"});
    }

    Admin.findOne({username: username}).then((admin) => {
        if (!admin){
            return res.status(204).send({message: "No admin Found"})
        } 
        return res.status(200).send(admin);
    })
}

function updateAdmin(req, res){
    // TODO
    return res.status(501);
}

function deleteAdmin(req, res){
    const {username} = req.body;

    if (!username) {
        return res.status(418).send({message: "missing details"});
    }

    Admin.deleteOne({username: username}).then((err, result) => {
        if (err){
            return res.status(204).send({message: "Something went wrong"})
        } 
        
        return res.status(200).send({message: "Admin deleted"});
    })
}

function loginAdmin(req, res){
    const {username, password} = req.body;

    if (!username || !password) {
        return res.status(418).send({message: "missing details"});
    }
    
    Admin.findOne({username: username, password: password}).then((admin) => {
        if (!admin){
            return res.status(204).send({message: "No such admin Found"})
        } 

        const access_token = jwt.sign(admin.toJSON(), process.env.ADMINTOKEN)
        return res.status(200).send({access_token});
    })   
}

function authenticate_admin_token(req, res, next){
    const token_header = req.headers['authorization']
    const token = token_header && token_header.split(' ')[1]
    if (!token){
        return res.status(418).send({message: "no token given"});
    }
    jwt.verify(token, process.env.ADMINTOKEN, (error, val) => {
        if (error){
            return res.status(403).send({message: "Your token doesn't give you this access"});
        }
        // can also cehck if returned admin is still in admin list
        next();
    });
}

module.exports = {createAdmin, readAdmin, updateAdmin, deleteAdmin, loginAdmin, authenticate_admin_token}