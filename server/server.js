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
// This endpoint adds a new subscriber to Shopify
app.post('/subscribe', async (req, res) => {
    const { email } = req.body;

    const addToShopify = async (email) => {
        // Check if the email already exists in Shopify
        const existingCustomers = await shopify.customer.list({ email });
        if (existingCustomers.length > 0) {
            throw new Error("Email is already subscribed")
        }

        await shopify.customer.create({
            email,
            tags: 'Newsletter Subscriber',
        });
    }

    try {
        await addToShopify(email);
        res.status(201).json({ message: 'Thank you for subscribing!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
});

// Get all products from Shopify, along with filtering options
app.get('/products', async (req, res) => {
    const { title, vendor, product_type, limit, page } = req.query;
    const options = {};
    if (title) options.title = title;
    if (vendor) options.vendor = vendor;
    if (product_type) options.product_type = product_type;
    if (limit) options.limit = parseInt(limit, 10);
    if (page) options.page = parseInt(page, 10);

    try {
        const products = await shopify.product.list(options);
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

app.get('/blogs', async (req, res) => {
    try {
        const blogs = await shopify.blog.list();
        res.json(blogs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/blogs/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const blog = await shopify.blog.get(id);
        res.json(blog);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Pay for the Shopify cart
app.post('/cart/pay', async (req, res) => {
    const { email, lineItems } = req.body;

    if (!email || !lineItems || !Array.isArray(lineItems) || lineItems.length === 0) {
        return res.status(400).json({ message: 'Invalid request payload' });
    }

    try {
        // Create a draft order in Shopify
        const draftOrder = await shopify.draftOrder.create({
            email,
            line_items: lineItems,
            use_customer_default_address: true,
        });

        // Complete the draft order to process payment
        const completedOrder = await shopify.draftOrder.complete(draftOrder.id);

        res.status(201).json({
            message: 'Payment successful',
            order: completedOrder,
        });
    } catch (error) {
        console.error('Error processing payment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
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
