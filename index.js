const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000

// middleware
app.use(cors())
app.use(express.json())
require('dotenv').config()


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.p7qt4j9.mongodb.net/?retryWrites=true&w=majority`;

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
        
        const menuCollection = client.db('menuCollection').collection('menu')
        const cartCollection = client.db('menuCollection').collection('carts')
        const reviewCollection = client.db('reviewCollection').collection('review')


        app.get('/menu/:item', async(req, res)=>{
            const categoryName = req.params.item
            const query = {category: categoryName }
            const cursor = menuCollection.find(query)
            const result =await cursor.toArray()
            res.send(result)
        })

        app.get('/review', async(req , res)=>{
            const cursor = reviewCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/cartItem/:email', async(req, res)=>{
            const userEmail = req.params.email
            const query = {email : userEmail}
            const result = await cartCollection.find(query).toArray()
            res.send(result)
        })

        app.post('/carts', async(req, res)=>{
            const productData = req.body
            console.log(productData);
            const result = await cartCollection.insertOne(productData)
            res.send(result)
        })

        app.delete('/carts/delete', async(req, res)=>{
            const deleteId = req.query.id
            const query = {_id: new ObjectId(deleteId)}
            const result = await cartCollection.deleteOne(query)
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('port is running');
})

app.listen(port, () => {
    console.log(`port is running ${port}`);
})