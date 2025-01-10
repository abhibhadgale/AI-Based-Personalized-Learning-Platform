import mongoose from 'mongoose';

const cartSchema = mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subjectIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }],
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
