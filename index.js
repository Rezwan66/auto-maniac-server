const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// MongoDB

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zjzxbzp.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        const productCollection = client.db("automotiveDB").collection("products");
        const cartCollection = client.db("automotiveDB").collection("cart");

        // GET api to get all products
        app.get('/products', async (req, res) => {
            const cursor = productCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        // GET api to get all cart products
        app.get('/cartProducts', async (req, res) => {
            const cursor = cartCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        // GET api to get products by brand name
        app.get('/products/:name', async (req, res) => {
            const name = req.params.name;
            const query = { brand: name };
            const cursor = productCollection.find(query);
            const result = await cursor.toArray();
            console.log(result);
            res.send(result);
        })

        // GET api to get a single product by id
        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await productCollection.findOne(query);
            res.send(result);
        })

        // GET api to get a single cart product by id
        app.get('/cartProducts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await cartCollection.findOne(query);
            res.send(result);
        })

        // POST api to add products
        app.post('/products', async (req, res) => {
            const product = req.body;
            console.log(product);
            const result = await productCollection.insertOne(product);
            res.send(result);
        })

        // POST api to add products to cart
        app.post('/cartProducts', async (req, res) => {
            const userProduct = req.body;
            console.log(userProduct);
            const result = await cartCollection.insertOne(userProduct);
            res.send(result);
        })

        // PUT api to update product in product collection
        app.put('/product/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedProduct = req.body;
            console.log(updatedProduct);
            const newProduct = {
                $set: {
                    image: updatedProduct.image,
                    name: updatedProduct.name,
                    brand: updatedProduct.brand,
                    type: updatedProduct.type,
                    price: updatedProduct.price,
                    rating: updatedProduct.rating,
                    description: updatedProduct.description,
                }
            };
            console.log(newProduct);
            const result = await productCollection.updateOne(filter, newProduct, options);
            res.send(result);
        })

        // DELETE a product from the cart using id
        app.delete('/cartProducts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await cartCollection.deleteOne(query);
            res.send(result);
        })

    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


// local
app.get('/', (req, res) => {
    res.send('Auto-Maniac server is running! 🚗🚗🚗');
})

app.listen(port, () => {
    console.log(`Auto-Maniac server running at port: ${port}`);
})