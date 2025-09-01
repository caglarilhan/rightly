const express = require('express');
const { shopifyApi, LATEST_API_VERSION } = require('@shopify/shopify-api');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Shopify API configuration
const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY || 'dev_key',
  apiSecretKey: process.env.SHOPIFY_API_SECRET || 'dev_secret',
  scopes: (process.env.SHOPIFY_SCOPES || 'read_customers,read_orders,read_products').split(','),
  hostName: process.env.SHOPIFY_HOST || 'http://localhost:3000',
  isEmbeddedApp: true,
  apiVersion: LATEST_API_VERSION
});

app.use(express.json());

// GDPR Hub Lite Backend API
const GDPR_API = {
  baseURL: process.env.GDPR_BACKEND_URL || 'http://127.0.0.1:9011',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.GDPR_API_KEY || 'dev_key'}`
  }
};

// Health check endpoint
app.get('/healthz', (req, res) => {
  res.json({ ok: true, service: 'shopify-plugin' });
});

// Webhook handlers for GDPR compliance
app.post('/webhooks/customers/data_request', async (req, res) => {
  try {
    console.log('📧 Shopify GDPR Data Request received:', req.body);
    
    const { shop_domain, customer } = req.body;
    
    // Create DSAR request in GDPR Hub Lite
    const dsarRequest = {
      account_email: `${shop_domain}@shopify.com`,
      request_type: 'access',
      subject_email: customer.email,
      subject_name: `${customer.first_name} ${customer.last_name}`,
      description: 'Shopify GDPR Data Request',
      additional_info: {
        shop_domain,
        customer_id: customer.id,
        source: 'shopify'
      }
    };
    
    const response = await axios.post(
      `${GDPR_API.baseURL}/api/v1/requests/`,
      dsarRequest,
      { headers: GDPR_API.headers }
    );
    
    console.log('✅ DSAR request created:', response.data);
    res.status(200).send('OK');
    
  } catch (error) {
    console.error('❌ Error processing GDPR data request:', error);
    res.status(500).send('Error');
  }
});

app.post('/webhooks/customers/redact', async (req, res) => {
  try {
    console.log('🗑️ Shopify GDPR Customer Redact received:', req.body);
    
    const { shop_domain, customer } = req.body;
    
    // Create erasure request in GDPR Hub Lite
    const erasureRequest = {
      account_email: `${shop_domain}@shopify.com`,
      request_type: 'erasure',
      subject_email: customer.email,
      subject_name: `${customer.first_name} ${customer.last_name}`,
      description: 'Shopify GDPR Customer Erasure',
      additional_info: {
        shop_domain,
        customer_id: customer.id,
        source: 'shopify'
      }
    };
    
    const response = await axios.post(
      `${GDPR_API.baseURL}/api/v1/requests/`,
      erasureRequest,
      { headers: GDPR_API.headers }
    );
    
    console.log('✅ Erasure request created:', response.data);
    res.status(200).send('OK');
    
  } catch (error) {
    console.error('❌ Error processing GDPR customer redact:', error);
    res.status(500).send('Error');
  }
});

app.post('/webhooks/shop/redact', async (req, res) => {
  try {
    console.log('🏪 Shopify GDPR Shop Redact received:', req.body);
    
    const { shop_domain } = req.body;
    
    // Handle shop redact (delete all shop data)
    const shopRedactRequest = {
      account_email: `${shop_domain}@shopify.com`,
      request_type: 'shop_redact',
      description: 'Shopify GDPR Shop Redact',
      additional_info: {
        shop_domain,
        source: 'shopify'
      }
    };
    
    const response = await axios.post(
      `${GDPR_API.baseURL}/api/v1/requests/`,
      shopRedactRequest,
      { headers: GDPR_API.headers }
    );
    
    console.log('✅ Shop redact request created:', response.data);
    res.status(200).send('OK');
    
  } catch (error) {
    console.error('❌ Error processing GDPR shop redact:', error);
    res.status(500).send('Error');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Shopify Plugin running on port ${PORT}`);
  console.log(`📡 GDPR Backend URL: ${GDPR_API.baseURL}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/healthz`);
});

