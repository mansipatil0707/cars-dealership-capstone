const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3030;

app.use(cors());
app.use(require('body-parser').urlencoded({ extended: false }));
app.use(express.json());

const reviewsData = JSON.parse(fs.readFileSync('reviews.json', 'utf8'));
const dealershipsData = JSON.parse(fs.readFileSync('dealerships.json', 'utf8'));

const mongoUrl = process.env.MONGO_URL || 'mongodb://mongo_db:27017/';
const Reviews = require('./review');
const Dealerships = require('./dealership');

async function seed() {
  try {
    // Seed only empty collections so restarting the service does not erase reviews.
    if (await Reviews.countDocuments() === 0) {
      await Reviews.insertMany(reviewsData.reviews);
    }
    if (await Dealerships.countDocuments() === 0) {
      await Dealerships.insertMany(dealershipsData.dealerships);
    }
    console.log('Database ready');
  } catch (error) {
    console.error('Error seeding database', error);
  }
}

// Express route to home
app.get('/', (req, res) => {
  res.send('Welcome to the Mongoose API');
});

// Fetch all reviews
app.get('/fetchReviews', async (req, res) => {
  try {
    res.json(await Reviews.find());
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// Fetch reviews for a particular dealer
app.get('/fetchReviews/dealer/:id', async (req, res) => {
  try {
    res.json(await Reviews.find({ dealership: req.params.id }));
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// Fetch all dealerships
app.get('/fetchDealers', async (req, res) => {
  try {
    res.json(await Dealerships.find());
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// Fetch dealerships by state
app.get('/fetchDealers/:state', async (req, res) => {
  try {
    res.json(await Dealerships.find({ state: req.params.state }));
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// Fetch a dealership by id
app.get('/fetchDealer/:id', async (req, res) => {
  try {
    res.json(await Dealerships.find({ id: req.params.id }));
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// Insert a review. express.json() above has already parsed application/json bodies.
app.post('/insert_review', async (req, res) => {
  try {
    const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const documents = await Reviews.find().sort({ id: -1 });
    const newId = documents.length > 0 ? documents[0].id + 1 : 1;

    const review = new Reviews({
      id: newId,
      name: data.name,
      dealership: data.dealership,
      review: data.review,
      purchase: data.purchase,
      purchase_date: data.purchase_date,
      car_make: data.car_make,
      car_model: data.car_model,
      car_year: data.car_year,
    });

    const savedReview = await review.save();
    res.json(savedReview);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error inserting review' });
  }
});

mongoose.connect(mongoUrl, { dbName: 'dealershipsDB' })
  .then(async () => {
    await seed();
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Could not connect to MongoDB:', error.message);
    process.exitCode = 1;
  });
