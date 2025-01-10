import express from 'express';
import {
  addItemToCart,
  getCartItems,
  removeItemFromCart,
} from '../controllers/cartController.js';
import { protect as authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/add', authMiddleware, addItemToCart); // Add item to cart
router.get('/', authMiddleware, getCartItems); // Fetch cart items
router.delete('/remove', authMiddleware, removeItemFromCart); // Remove item from cart

export default router;
