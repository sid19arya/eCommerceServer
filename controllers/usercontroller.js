const User = require('../models/user')
const Product = require('../models/product')
const jwt = require('jsonwebtoken')
const saleController = require('./salecontroller');


function createUser(req, res){

    if (!req.body.username || !req.body.password) {
        return res.status(418).send({message: "missing details"});
    }
    
    if (!req.body.created){
        req.body.created = new Date();
    }
    if (!req.body.cart){
        req.body.cart = {};
    }
    if (!req.body.wishlist){
        req.body.wishlist = [];
    }
    if (!req.body.coupons){
        req.body.coupons = [];
    }
    
    const newUser = new User({
        username: req.body.username,
        password: req.body.password,
        created: req.body.created,
        cart: req.body.cart,
        wishlist: req.body.wishlist,
        coupons: req.body.coupons
    })

    newUser.save().then(() => {
        return res.status(200).send({message: "Successfully created User"})
    })
}

function readUser(req, res){
    const {username} = req.params;

    if (!username) {
        return res.status(418).send({message: "missing details"});
    }

    User.findOne({username: username}).then((user) => {
        if (!user){
            return res.status(204).send({message: "No user Found"})
        } 
        user.password = "_REDACTED_"
        return res.status(200).send(user);
    })
}

function updateUser(req, res){
    // TODO
    return res.status(501);
}

function deleteUser(req, res){
    const {username} = req.body;

    if (!username) {
        return res.status(418).send({message: "missing details"});
    }

    User.deleteOne({username: username}).then((err, result) => {
        if (err){
            return res.status(204).send({message: "Something went wrong"})
        } 
        
        return res.status(200).send({message: "User deleted"});
    })
}

function loginUser(req, res){
    const {username, password} = req.body;

    if (!username || !password) {
        return res.status(418).send({message: "missing details"});
    }
    
    User.findOne({username: username, password: password}).then((user) => {
        if (!user){
            return res.status(204).send({message: "No user Found"})
        } 
        
        const access_token = jwt.sign(user.toJSON(), process.env.USERTOKEN)
        return res.status(200).send({access_token});
    })   
}

function authenticate_user_token(req, res, next){
    const token_header = req.headers['authorization']
    const token = token_header && token_header.split(' ')[1]
    if (!token){
        return res.status(418).send({message: "no token given"});
    }
    jwt.verify(token, process.env.USERTOKEN, (error, val) => {
        if (error){
            return res.status(403).send({message: "Your token doesn't give you this access"});
        }
        // can also cehck if returned user is THE SAME USER TRYING TO DO PROTECTED TASK
        // console.log(val);
        req.body.authenticated_user = val;
        next();
    });
}

function addProdtoUserCart(req, res){
    const req_user = req.params.username;
    // const {title} = req.params;
    // req.boody.username, quantity, authenticated_user
    if (!(req_user == req.body.authenticated_user.username)){
        return res.status(403).send({message: "This action is forbidden"});
    }
    
    User.findOne({username: req_user}).then((user) => {
        if (!user){
            return res.status(204).send({message: "No user Found"})
        } 

        if (!user.cart[req.body.title]){
            user.cart[req.body.title] = req.body.quantity;
        } else {
            user.cart[req.body.title] += req.body.quantity;
        }
        
        user.markModified('cart');
        user.save().then(() => {
            console.log(user)
            return res.status(200).send({msg: "the product was added to cart"})
        })
    })   
}

function getCart(req, res){
    const req_user = req.params.username;

    User.findOne({username: req_user}).then(user => {
        if (!user){
            return res.status(204).send({message: "No user Found"})
        } 
        const cart = user.cart;
        return res.status(200).send({cart})
    });
}

function purchaseCart(req, res){
    const req_user = req.params.username;

    let sum = 0;

    User.findOne({username: req_user}).then( async (user) => {
        if (!user){
            return res.status(204).send({message: "No user Found"})
        } 
        const products = Object.keys(user.cart)
        
        const sum_calc = products.map(async (prod) => {
            const single_prod = await Product.findOne({title: prod})
            sum += single_prod.price * user.cart[prod];

            single_prod.stock -= user.cart[prod];
            single_prod.markModified();
            await single_prod.save();
        });
        await Promise.all(sum_calc);
        
        // saleController.generateSaleReport(x,y,z)

        user.cart = {};
        user.markModified('cart');
        await user.save();
        
        
        return res.status(200).send({
            msg: "Your purchase was succesful, Your card will be charged the amount stated below",
            cost: sum
        })
        });
}

function purchaseProduct(req, res){
    const req_user = req.params.username;

    

}

function cartSaleReport(){

}




module.exports = {createUser, readUser, updateUser, deleteUser, 
    loginUser, authenticate_user_token, addProdtoUserCart, getCart, 
    purchaseCart, purchaseProduct
    }