export const products = [
    {
      id: "1",
      name: "Apple iPhone 14",
      price: 999,
      stock: 20,
      category: "Electronics",
      description: "Latest iPhone with advanced features.",
      image:"https://www.apple.com/v/iphone/home/bx/images/overview/select/iphone_14__eso1fig4ci6a_xlarge.png"
    },
    {
      id: "2",
      name: "Samsung Galaxy S23",
      price: 899,
      stock: 15,
      category: "Electronics",
      description: "Next-gen Samsung Galaxy smartphone.",
      image: "https://images.samsung.com/ae/smartphones/galaxy-s23/images/galaxy-s23-highlights-color-back-lavender.jpg",
    },
  ];
  
  export const orders = [
    {
      id: "101",
      customerName: "John Doe",
      totalAmount: 1898,
      status: "Completed",
      items: [
        { product: "Apple iPhone 14", quantity: 1 },
        { product: "Samsung Galaxy S23", quantity: 1 },
      ],
    },
    {
      id: "102",
      customerName: "Jane Smith",
      totalAmount: 999,
      status: "Pending",
      items: [{ product: "Apple iPhone 14", quantity: 1 }],
    },
  ];
  