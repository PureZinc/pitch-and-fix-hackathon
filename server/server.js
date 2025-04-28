const express = require('express');
const { PrismaClient } = require('./generated/prisma/client');
const Shopify = require('shopify-api-node');
const cors = require('cors');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const port = 3000;

// Conect to Prisma database
prisma.$connect().catch((error) => {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
});
console.log('Connected to Prisma database');

// Check if required environment variables are set
console.log('Environment Variables:', {
    SHOPIFY_SHOP_NAME: process.env.SHOPIFY_SHOP_NAME,
    SHOPIFY_API_KEY: process.env.SHOPIFY_API_KEY,
    SHOPIFY_API_SECRET: process.env.SHOPIFY_API_SECRET,
    SHOPIFY_ACCESS_TOKEN: process.env.SHOPIFY_ACCESS_TOKEN,
    NODE_ENV: process.env.NODE_ENV,
});

// Initialize Shopify API client
const shopify = new Shopify({
    shopName: process.env.SHOPIFY_SHOP_NAME,
    accessToken: process.env.SHOPIFY_ACCESS_TOKEN,
    log: {
        // Enable logging in development
        log: process.env.NODE_ENV === 'development',
        level: process.env.NODE_ENV === 'development' ? 'info' : 'error'
    }
});

// Test Shopify connection
shopify.shop.get()
    .then((shop) => {
        console.log('Connected to Shopify:', shop.name);
    })
    .catch((error) => {
        console.error('Failed to connect to Shopify:', error);
        process.exit(1);
    });


// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Shopify + Prisma + Express Backend Running');
});

// Subscribe to newsletter
// This endpoint adds a new subscriber to the database and Shopify
app.post('/subscribe', async (req, res) => {
    const { email } = req.body;
    
    const addToDatabase = async (email) => {
        const existingSubscriber = await prisma.subscriber.findUnique({
            where: { email },
        });

        if (existingSubscriber) {
            return res.status(400).json({ message: 'Email already subscribed' });
        }

        // Create a new subscriber in the database
        const newSubscriber = await prisma.subscriber.create({
            data: { email },
        });

        return newSubscriber
    }

    const addToShopify = async (email) => { 
        await shopify.customer.create({
            email,
            tags: 'Newsletter Subscriber',
        });
    }

    try {
        await addToDatabase(email);
        await addToShopify(email);
        res.status(201).json({ message: 'Thank you for subscribing!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get all products from Shopify
app.get('/products', async (req, res) => {
    try {
        const products = await shopify.product.list();
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get a single product by ID
app.get('/products/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const product = await shopify.product.get(id);
        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Add a product to the cart (mock implementation)
app.post('/cart/add', (req, res) => {
    const { productId, quantity } = req.body;

    // Mock cart logic
    const cart = req.session.cart || [];
    const existingProduct = cart.find((item) => item.productId === productId);

    if (existingProduct) {
        existingProduct.quantity += quantity;
    } else {
        cart.push({ productId, quantity });
    }

    req.session.cart = cart;
    res.json(cart);
});

// Remove a product from the cart (mock implementation)
app.post('/cart/remove', (req, res) => {
    const { productId } = req.body;

    // Mock cart logic
    const cart = req.session.cart || [];
    const updatedCart = cart.filter((item) => item.productId !== productId);

    req.session.cart = updatedCart;
    res.json(updatedCart);
});


// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
