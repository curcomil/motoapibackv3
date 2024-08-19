import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  opinion: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
});

const questionSchema = new mongoose.Schema({
  body: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  response: {
    type: String,
    required: false,
  },
});

const productSchema = new mongoose.Schema({
  category: String,
  subcategory: String,
  images: String,
  productName: String,
  price: Number,
  stock: Number,
  description: String,
  reviews: {
    type: [reviewSchema],
    default: [],
  },
  questions: {
    type: [questionSchema],
    default: [],
  },
});

const Product = mongoose.model("Products", productSchema);

export default Product;
