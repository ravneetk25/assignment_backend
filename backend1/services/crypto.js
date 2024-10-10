const axios = require('axios');
const CryptoData = require('../models/data');
const cron = require('node-cron');

const COINS = ['bitcoin', 'matic-network', 'ethereum'];
const API_URL = 'https://api.coingecko.com/api/v3/simple/price';

const fetchCryptoData = async () => {
    try {
        for (const coin of COINS) {
            const response = await axios.get(`${API_URL}?ids=${coin}&vs_currencies=usd&include_market_cap=true&include_24hr_change=true`);
            const data = response.data[coin];

            const newCryptoData = new CryptoData({
                coin: coin,
                price: data.usd,
                marketCap: data.usd_market_cap,
                change24h: data.usd_24h_change,
            });

            await newCryptoData.save();
            console.log(`Saved data for ${coin}`);
        }
    } catch (error) {
        console.error('Error fetching data from CoinGecko:', error.message);
    }
};

cron.schedule('0 */2 * * *', fetchCryptoData);

module.exports = fetchCryptoData;
