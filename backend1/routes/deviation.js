const express = require('express');
const CryptoData = require('../models/data');
const router = express.Router();

const calculateStandardDeviation = (prices) => {
    const mean = prices.reduce((a, b) => a + b, 0) / prices.length;
    const variance = prices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / prices.length;
    return Math.sqrt(variance).toFixed(2);
};

router.get('/deviation', async (req, res) => {
    const { coin } = req.query;

    // Check if the coin parameter is provided
    if (!coin) {
        return res.status(400).json({ message: 'Coin parameter is required' });
    }

    try {
        // Fetch the latest 100 price records for the specified coin
        const data = await CryptoData.find({ coin }).sort({ timestamp: -1 }).limit(100);
        const prices = data.map(record => record.price);

        // Check if there are enough records to calculate the standard deviation
        if (prices.length < 2) {
            return res.status(400).json({ message: 'Not enough data to calculate deviation' });
        }

        // Calculate the standard deviation of the prices
        const deviation = calculateStandardDeviation(prices);
        res.json({ deviation: parseFloat(deviation) });
    } catch (error) {
        console.error('Error fetching data:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
