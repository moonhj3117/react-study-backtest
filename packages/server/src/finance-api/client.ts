import axios from 'axios'
import 'dotenv/config'


const  client = axios.create({
    baseURL: 'https://financialmodelingprep.com'
});

client.interceptors.request.use((config) => {
    config.params = {
        ...(config.params || {}),
        apikey: process.env.FINANCIAL_API_KEY
    }
    return config
})

export default client