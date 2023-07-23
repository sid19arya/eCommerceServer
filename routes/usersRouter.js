const express = require('express');
const router = express.Router();
const userController = require('../controllers/usercontroller')
const adminController = require('../controllers/admincontroller')
// const asyncHandler = require('express-async-handler') <= thought i would need this but I guess not



// router.get('/', (req, res) => {
//     return res.status(200).send({message: "User endpoint"});
// })

router.get('/test', (req, res) => {
    return res.status(200).send({msg: "User Endpoint Test"})
})


router.post('/', adminController.authenticate_admin_token, userController.createUser);

router.put('/', adminController.authenticate_admin_token, userController.updateUser);

router.delete('/', adminController.authenticate_admin_token, userController.deleteUser);

router.post('/login', userController.loginUser);

router.post('/signup', userController.signupUser)

router.get('/:username', userController.readUser); 

router.post('/:username/cart', userController.authenticate_user_token, userController.addProdtoUserCart)
router.post('/:username/wishlist', userController.authenticate_user_token, userController.addProdtoUserWishlist)
// router.post('/:username/wishlist', ..., ...)

router.get('/:username/cart', userController.authenticate_user_token, userController.getCart)
router.get('/:username/wishlist', userController.authenticate_user_token, userController.getWishlist)

// router.get('/:username/sale-report', userController.authenticate_user_token)

router.post('/:username/purchase-cart', userController.authenticate_user_token, userController.purchaseCart)
router.post('/:username/purchase-product', userController.authenticate_user_token, userController.purchaseProduct)



module.exports = router;