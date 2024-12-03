//require("dotenv").config();
import "dotenv/config";
//require("@shopify/shopify-api/adapters/node");
//const { shopifyApi, LATEST_API_VERSION } = require("@shopify/shopify-api");
import "@shopify/shopify-api/adapters/node";
import { shopifyApi } from "@shopify/shopify-api";

const shopify = shopifyApi({
  apiKey: process.env.API_KEY,
  apiSecretKey: process.env.API_SECRET,
  scopes: process.env.SHOPIFY_APP_SCOPES,
  hostName: process.env.HOST_NAME,
});

const session = {
  shop: process.env.SHOPIFY_STORE,
  accessToken: process.env.SHOPIFY_ACCESS_TOKEN,
};

const queryString = `{
    products (first: 3) {
      edges {
        node {
          id
          title
        }
      }
    }
  }`;

// `session` is built as part of the OAuth process
const client = new shopify.clients.Graphql({ session });
const products = await client.query({
  data: queryString,
});
console.log(JSON.stringify(products, null, 2));
