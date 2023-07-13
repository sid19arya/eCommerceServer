const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admincontroller')

// router.get('/', (req, res) => {
//     return res.status(200).send({message: "admin endpoint"});
// })

router.get('/:username', adminController.readAdmin);

router.post('/', adminController.createAdmin);

router.put('/', adminController.updateAdmin);

router.delete('/', adminController.deleteAdmin);

router.post('/login', adminController.loginAdmin);

module.exports = router;