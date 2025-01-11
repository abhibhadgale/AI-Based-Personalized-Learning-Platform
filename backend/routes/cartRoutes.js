import express from 'express';
import {
  addItemToCart,
  getCartItems,
  removeItemFromCart,
  addMultipleItemsToCart,
  handleCheckout,
} from '../controllers/cartController.js';
import { protect as authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/add', authMiddleware, addItemToCart); // Add item to cart
router.get('/', authMiddleware, getCartItems); // Fetch cart items
router.delete('/remove', authMiddleware, removeItemFromCart); // Remove item from cart
router.post("/add-multiple", authMiddleware, addMultipleItemsToCart);

// Checkout Route
router.post('/checkout', authMiddleware, handleCheckout);

export default router;
