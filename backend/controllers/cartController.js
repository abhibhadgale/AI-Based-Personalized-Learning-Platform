import Cart from '../models/Cart.js';
import EnrolledStudent from '../models/EnrolledStudent.js'; // EnrolledStudent model


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


export const addMultipleItemsToCart = async (req, res) => {
  const studentId = req.user._id; // Use logged-in user's ID
  const { subjectIds } = req.body;

  try {
    const existingCart = await Cart.findOne({ studentId });
    if (existingCart) {
      // Filter out subjects that are already in the cart to prevent duplication
      const newSubjectIds = subjectIds.filter(
        (subjectId) => !existingCart.subjectIds.includes(subjectId)
      );

      // If there are no new subjects to add, return a response
      if (newSubjectIds.length === 0) {
        return res.status(400).json({ message: 'All subjects are already in the cart' });
      }

      // Add only the new subjects to the cart
      existingCart.subjectIds = [...existingCart.subjectIds, ...newSubjectIds];
      await existingCart.save();
      return res.status(201).json({ success: true, message: 'Semester package added to cart successfully' });
    } else {
      const newCart = new Cart({
        studentId,
        subjectIds,
      });
      await newCart.save();
      return res.status(201).json({ success: true, message: 'Semester package added to cart successfully' });
    }
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).json({ error: 'Failed to add semester package to cart' });
  }
};

// Handle Checkout Process
export const handleCheckout = async (req, res) => {
  try {
    const { subjectIds } = req.body;
    const studentId = req.user._id; // Use `studentId` here

    // 1. Find the cart items from the cart collection
    const cart = await Cart.findOne({ studentId });

    if (!cart || !cart.subjectIds || cart.subjectIds.length === 0) {
      return res.status(400).json({ message: 'Your cart is empty.' });
    }

    // 2. Remove the selected courses from the cart
    await Cart.updateOne(
      { studentId },
      { $pull: { subjectIds: { $in: subjectIds } } }
    );

    // 3. Add the courses to the enrolled-student collection
    const enrolledStudent = new EnrolledStudent({
      studentId,
      subjects: subjectIds,
      enrolledAt: new Date(),
    });

    await enrolledStudent.save();

    // 4. Respond with success message
    res.status(200).json({ message: 'Checkout successful, courses added to enrolled list.' });
  } catch (error) {
    console.error('Error during checkout:', error);
    res.status(500).json({ message: 'An error occurred during checkout.' });
  }
};
