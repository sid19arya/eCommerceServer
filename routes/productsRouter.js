const express = require('express');
const router = express.Router();
const productController = require('../controllers/productcontroller')
const adminController = require('../controllers/admincontroller')
const userController = require('../controllers/usercontroller')

// router.get('/', (req, res) => {
//     return res.status(200).send({message: "Product endpoint"});
// })

router.get('/', productController.getProducts)


router.get('/:title', productController.readProduct);

router.post('/', adminController.authenticate_admin_token, productController.createProduct);

router.put('/', adminController.authenticate_admin_token, productController.updateProduct);

router.delete('/', adminController.authenticate_admin_token, productController.deleteProduct);


module.exports = router;