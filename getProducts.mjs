//require("dotenv").config();
import "dotenv/config";
const { SHOPIFY_STORE, SHOPIFY_ACCESS_TOKEN } = process.env;
// const fetch = require("node-fetch");
//cls
import fetch from "node-fetch";

// Shopify GraphQL endpoint
const graphqlEndpoint = `https://${SHOPIFY_STORE}/admin/api/2024-10/graphql.json`;

// GraphQL query to fetch products
const query = `
  {
    products(first: 5) {
      edges {
        node {
          id
          title
          handle
          description
          variants(first: 1) {
            edges {
              node {
                id
                title
              }
            }
          }
        }
      }
    }
  }
`;

// Make a GraphQL request to Shopify
// fetch(graphqlEndpoint, {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//     "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
//   },
//   body: JSON.stringify({ query }),
// })
//   .then((response) => response.json())
//   .then((data) => {
//     // Handle the GraphQL response here
//     console.log(JSON.stringify(data, null, 2));
//   })
//   .catch((error) => console.error("Error fetching products:", error));
try {
  const response = await fetch(graphqlEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
    },
    body: JSON.stringify({ query }),
  });

  const data = await response.json();
  // res.json(data);
  //console.log(data);
  const simplifiedResponse = transformResponse(data);
  console.log(JSON.stringify(data, null, 2));
  console.log(simplifiedResponse);
} catch (error) {
  console.error("Error fetching products:", error);
  //res.status(500).json({ error: "Internal Server Error" });
}
function transformResponse(data) {
  return {
    products: data.data.products.edges.map((productEdge) => {
      const productNode = productEdge.node;
      return {
        id: productNode.id.replace("gid://shopify/Product/", ""),
        title: productNode.title,
        handle: productNode.handle,
        description: productNode.description,
        variants: productNode.variants.edges.map((variantEdge) => {
          const variantNode = variantEdge.node;
          return {
            id: variantNode.id.replace("gid://shopify/ProductVariant/", ""),
            title: variantNode.title,
          };
        }),
      };
    }),
  };
}
