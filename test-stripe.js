const { HttpsProxyAgent } = require('https-proxy-agent');
const proxy = process.env.https_proxy || process.env.http_proxy;
const agent = proxy ? new HttpsProxyAgent(proxy) : undefined;
const stripe = require('stripe')(process.env.STRIPE_SK, { httpAgent: agent });

stripe.customers.list({ limit: 1 })
  .then(res => console.log(res))
  .catch(err => console.error(err));
