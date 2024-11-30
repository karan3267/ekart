const mongoose = require("mongoose");
const Product = require("./src/models/Product");
const Category = require("./src/models/Category");
require("dotenv").config();

const categories = [
  {
    name: "Electronics",
    description: "Latest gadgets, appliances, and tech products.",
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=2020&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Fashion",
    description: "Trendy apparel and accessories for all seasons.",
    image: "https://plus.unsplash.com/premium_photo-1675186049366-64a655f8f537?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Books",
    description: "Books across all genres and languages.",
    image: "https://unsplash.com/photos/a-stack-of-books-f80d5O78Bmo",
  },
  {
    name: "Home & Kitchen",
    description: "Essential and decorative items for your home.",
    image: "https://unsplash.com/photos/a-bowl-of-wooden-utensils-and-a-cutting-board-cnBarNOhVBU",
  },
  {
    name: "Beauty & Personal Care",
    description: "Products for skincare, haircare, and grooming.",
    image: "https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

const products = [
  {
    category: "Electronics",
    items: [
      {
        name: "Samsung A12",
        description: "Latest 5G smartphone with 128GB storage.",
        brand: "Samsung",
        price: 799,
        stock: 50,
        images: ["https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D","https://m.media-amazon.com/images/I/81HPWFk9kvL._AC_SL1433_.jpg","https://m.media-amazon.com/images/I/71rIC5+Dj1S._AC_SL1498_.jpg","https://m.media-amazon.com/images/I/71cezhupv4L._AC_SL1498_.jpg"],
        ratings: { average: 4.5, count: 120 },
        isFeatured: true,
      },
      {
        name: "Boat Stone 1450",
        description: "Portable speaker with high-quality sound.",
        brand: "SoundMax",
        price: 99,
        stock: 30,
        images: ["https://m.media-amazon.com/images/I/71RWq2CjD-L._AC_SL1500_.jpg","https://m.media-amazon.com/images/I/71ge+hwqeRL._AC_SL1500_.jpg","https://m.media-amazon.com/images/I/61JsClraf-L._AC_SL1500_.jpg"],
        ratings: { average: 4.2, count: 80 },
      },
      {
        name: "LG TV 65-inch",
        description: "4K UHD OLED Smart TVLG 65 Inch TV OLED Cinema Screen Design 4K Cinema HDR WebOS Smart With ThinQ AI Pixel Dimming.",
        brand: "ScreenPro",
        price: 3199,
        stock: 15,
        images: ["https://m.media-amazon.com/images/I/61NJbsCRJ+L._AC_SL1000_.jpg","https://m.media-amazon.com/images/I/71wGlAkbJxL._AC_SL1500_.jpg","https://m.media-amazon.com/images/I/31Qike-kAfL._AC_SL1500_.jpg","https://m.media-amazon.com/images/I/613yDmk01YL._AC_SL1500_.jpg"],
        ratings: { average: 4.9, count: 50 },
        isFeatured: true,
      },
      {
        name: "Noise Cancelling Headphones",
        description: "Wireless headphones with active noise cancellation.",
        brand: "SoundElite",
        price: 299,
        stock: 40,
        images: ["https://example.com/headphones1.jpg"],
        ratings: { average: 4.6, count: 95 },
      },
      {
        name: "Laptop Pro X",
        description: "High-performance laptop for professionals.",
        brand: "CompuTech",
        price: 1599,
        stock: 20,
        images: ["https://example.com/laptop1.jpg"],
        ratings: { average: 4.8, count: 70 },
        isFeatured: true,
      },
    ],
  },
  {
    category: "Fashion",
    items: [
      {
        name: "Classic Leather Jacket",
        description: "Timeless leather jacket for all seasons.",
        brand: "Fashionista",
        price: 199,
        stock: 25,
        images: ["https://example.com/jacket1.jpg"],
        ratings: { average: 4.5, count: 60 },
      },
      {
        name: "Men's Running Shoes",
        description: "Comfortable and durable running shoes.",
        brand: "RunnerX",
        price: 129,
        stock: 35,
        images: ["https://example.com/shoes1.jpg"],
        ratings: { average: 4.3, count: 90 },
      },
      {
        name: "Women's Summer Dress",
        description: "Light and breathable summer dress.",
        brand: "ChicWear",
        price: 79,
        stock: 45,
        images: ["https://example.com/dress1.jpg"],
        ratings: { average: 4.7, count: 40 },
      },
      {
        name: "Designer Handbag",
        description: "Elegant handbag with ample storage.",
        brand: "BagLuxury",
        price: 349,
        stock: 15,
        images: ["https://example.com/handbag1.jpg"],
        ratings: { average: 4.6, count: 30 },
        isFeatured: true,
      },
      {
        name: "Woolen Scarf",
        description: "Soft and warm scarf for winter.",
        brand: "WarmThreads",
        price: 49,
        stock: 60,
        images: ["https://example.com/scarf1.jpg"],
        ratings: { average: 4.4, count: 20 },
      },
    ],
  },
  // Add more categories and products...
];

const populateData = async () => {
  try {
    // Connect to the database
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB!");

    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});

    // Insert categories
    const insertedCategories = await Category.insertMany(categories);
    console.log("Categories inserted:", insertedCategories.length);

    // Insert products
    for (const { category, items } of products) {
      const categoryExists = await Category.findOne({ name: category });
      if (!categoryExists) {
        console.error(`Category "${category}" does not exist. Skipping...`);
        continue;
      }

      const categoryId = categoryExists._id;
      const productsToInsert = items.map((item) => ({
        ...item,
        category: categoryId,
      }));

      const insertedProducts = await Product.insertMany(productsToInsert);
      console.log(
        `Products inserted for category "${category}":`,
        insertedProducts.length
      );
    }

    console.log("Database populated successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error populating data:", error);
    process.exit(1);
  }
};

populateData();
