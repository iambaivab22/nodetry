const mongoose = require("mongoose");

const OrderProductSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: Number,
      price: Number,
    },
  ],
  isInsideValley: Boolean,
  OrderedAt: String,
  shippingLocation: String,
});

// const cartSchema = new mongoose.Schema({});

module.exports = mongoose.model("Orders", OrderProductSchema);
