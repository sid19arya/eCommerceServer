const Product = require('../models/product')

function createProduct(req, res){

    if (!req.body.title || !req.body.price) {
        return res.status(418).send({message: "missing details"});
    }

    if (!req.body.categories){
        req.body.categories = [];
    }
    if (!req.body.stock){
        req.body.stock = 1;
    }
    if (!req.body.imageurl){
        req.body.imageurl = '';
    }

    
    const newProduct = new Product({
        title: req.body.title,
        price: req.body.price,
        categories: req.body.categories,
        stock: req.body.stock,
        imageurl: req.body.imageurl
    })

    newProduct.save().then(() => {
        return res.status(200).send({message: "Successfully created product"})
    })
}

function readProduct(req, res){
    const {title} = req.body;

    if (!title) {
        return res.status(418).send({message: "missing details"});
    }

    Product.findOne({title: title}).then((product) => {
        if (!product){
            return res.status(204).send({message: "No product Found"})
        } 
        return res.status(200).send(product);
    })
}

function updateProduct(req, res){
    // TODO
    return res.status(501);
}

function deleteProduct(req, res){
    const {title} = req.params;

    if (!title) {
        return res.status(418).send({message: "missing details"});
    }

    Product.deleteOne({title: title}).then((err, result) => {
        if (err){
            return res.status(204).send({message: "Something went wrong"})
        } 
        
        return res.status(200).send({message: "Product deleted"});
    })
}

function getProducts(req, res){
    Product.find().limit(10).then((posts) => {
        if (!posts){
            return res.status(400).send({msg: "Something Went wrong :("})
        }
        return res.status(200).send({posts});
    })
}

module.exports = {createProduct, readProduct, updateProduct, deleteProduct, getProducts}