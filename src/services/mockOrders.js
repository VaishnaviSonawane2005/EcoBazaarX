export const mockOrders = [
  {
    id: "ORD-2024-001",
    date: "2024-10-25",
    status: "delivered",
    items: 3,
    total: 89.97,
    carbonFootprint: 6.5,
    product: "Organic Cotton T-Shirt",
    quantity: 3,
    price: 89.97,
    image: "https://m.media-amazon.com/images/I/71x-D2zqg-L._AC_SL1500_.jpg",
    tracking: [
      { status: "Order Placed", date: "2024-10-23" },
      { status: "Shipped", date: "2024-10-24" },
      { status: "Delivered", date: "2024-10-25" }
    ]
  },

  {
    id: "ORD-2024-002",
    date: "2024-10-20",
    status: "delivered",
    items: 2,
    total: 54.98,
    carbonFootprint: 3.7,
    product: "Bamboo Bottle",
    quantity: 2,
    price: 54.98,
    image: "https://m.media-amazon.com/images/I/61HxnIVvv5L._AC_SL1500_.jpg",
    tracking: [
      { status: "Order Placed", date: "2024-10-18" },
      { status: "Shipped", date: "2024-10-19" },
      { status: "Delivered", date: "2024-10-20" }
    ]
  },

  {
    id: "ORD-2024-003",
    date: "2024-10-15",
    status: "delivered",
    items: 1,
    total: 29.99,
    carbonFootprint: 2.5,
    product: "Solar Power Bank",
    quantity: 1,
    price: 29.99,
    image: "https://m.media-amazon.com/images/I/81GbVxo4nPL._AC_SL1500_.jpg",
    tracking: [
      { status: "Order Placed", date: "2024-10-13" },
      { status: "Shipped", date: "2024-10-14" },
      { status: "Delivered", date: "2024-10-15" }
    ]
  },

  {
    id: "ORD-2024-004",
    date: "2024-10-10",
    status: "cancelled",
    items: 2,
    total: 45.5,
    carbonFootprint: 0,
    product: "Eco Tote Bag",
    quantity: 2,
    price: 45.5,
    image: "https://m.media-amazon.com/images/I/81q5XduK3PL._AC_SL1500_.jpg",
    tracking: [
      { status: "Order Placed", date: "2024-10-10" },
      { status: "Cancelled", date: "2024-10-10" }
    ]
  }
];
