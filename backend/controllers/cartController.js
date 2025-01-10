import Cart from '../models/Cart.js';

export const addItemToCart = async (req, res) => {
  const studentId = req.user._id; // Use logged-in user's ID
  const { subjectId } = req.body;

  try {
    const existingCart = await Cart.findOne({ studentId });
    if (existingCart) {
      if (!existingCart.subjectIds.includes(subjectId)) {
        existingCart.subjectIds.push(subjectId);
        await existingCart.save();
      }
    } else {
      const newCart = new Cart({
        studentId,
        subjectIds: [subjectId],
      });
      await newCart.save();
    }
    res.status(201).json({ success: true, message: 'Item added to cart successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
};

export const getCartItems = async (req, res) => {
  const studentId = req.user._id; // Use logged-in user's ID

  try {
    const cart = await Cart.findOne({ studentId }).populate('subjectIds');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cart items' });
  }
};

export const removeItemFromCart = async (req, res) => {
  const studentId = req.user._id; // Use logged-in user's ID
  const { subjectId } = req.body;

  try {
    const cart = await Cart.findOne({ studentId });
    if (cart) {
      cart.subjectIds = cart.subjectIds.filter((id) => id.toString() !== subjectId);
      await cart.save();
      res.status(200).json({ message: 'Item removed from cart successfully' });
    } else {
      res.status(404).json({ message: 'Cart not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
};
