const wishlistSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    updatedAt: { type: Date, default: Date.now },
  });
  
  module.exports = mongoose.model("Wishlist", wishlistSchema);
  