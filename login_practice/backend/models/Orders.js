const mongoose=require('mongoose');

const familiarSchema = new mongoose.Schema({
  familiarId: {
    type: String, // keep as String if not referencing another collection
    required: true
  },
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  cost: {
    type: Number,
    required: true
  },
  dateTime: {
    type: String, // or use Date if you want real timestamps
    required: true
  }
});

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  familiars: {
    type: [familiarSchema], // array of familiar items in one order
    required: true
  },
  totalCost: {
    type: Number,
    required: true
  },
  dateTime: {
    type: String, // or Date
    required: true
  }
});

const Order = mongoose.model('Order', orderSchema);

module.exports=Order;
