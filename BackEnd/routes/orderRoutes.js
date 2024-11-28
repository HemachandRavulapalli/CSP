const express = require('express');
const orderController = require('../controllers/orderController');
const router = express.Router();

// GET all orders for a user
router.get('/', orderController.getUserOrders);

// PUT update order status
router.put('/:id', orderController.updateOrderStatus);

module.exports = router;
