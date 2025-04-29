// Global web data
const categories = [
  {
    id: 1,
    name: "Electronics",
    image: "images/category1.jpg",
    description: "Explore the latest in electronics",
    link: "/pages/categories.html#electronics"
  },
  {
    id: 2,
    name: "Clothing",
    image: "images/category2.jpg",
    description: "Discover trendy clothing options",
    link: "/pages/categories.html#clothing"
  },
  {
    id: 3,
    name: "Home & Kitchen",
    image: "images/category3.jpg",
    description: "Upgrade your home and kitchen essentials",
    link: "/pages/categories.html#home"
  },
  {
    id: 4,
    name: "Sports & Outdoors",
    image: "images/category4.jpg",
    description: "Gear up for sports and outdoor adventures",
    link: "/pages/categories.html#sports"
  }
];

const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        image: "/images/product1.jpg",
        tag: "Sale",
        originalPrice: 120,
        price: 99.99,
        rating: 4.5,
        ratingCount: 42,
        featured: true,
        categories: [1, 2]
    },
    {
        id: 2,
        name: "Smart Watch",
        image: "/images/product2.jpg",
        tag: null,
        price: 199.99,
        rating: 4,
        ratingCount: 28,
      featured: true,
        categories: [1, 4]
    },
    {
        id: 3,
        name: "Bluetooth Speaker",
        image: "/images/product3.jpg",
        tag: "New",
        price: 79.99,
        rating: 3.5,
        ratingCount: 17,
        featured: true,
        categories: [1, 4]
    },
    {
        id: 4,
        name: "Laptop Bag",
        image: "",
        tag: null,
        price: 49.99,
        rating: 5,
        ratingCount: 35,
        featured: true,
        categories: [2, 3]
    },
    {
      id: 5,
      name: "Gaming Mouse",
      image: "/images/product5.jpg",
      tag: "Hot",
      price: 59.99,
      rating: 4.8,
      ratingCount: 50,
      featured: false,
      categories: [1]
    },
    {
      id: 6,
      name: "Portable Charger",
      image: "/images/product6.jpg",
      tag: null,
      price: 29.99,
      rating: 4.2,
      ratingCount: 20,
      featured: false,
      categories: [1, 3]
    },
    {
      id: 7,
      name: "Desk Lamp",
      image: "/images/product7.jpg",
      tag: "Eco",
      price: 39.99,
      rating: 4.6,
      ratingCount: 15,
      featured: false,
      categories: [3]
    }
];
