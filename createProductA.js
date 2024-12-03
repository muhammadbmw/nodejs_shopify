require("dotenv").config();
const axios = require("axios");

const createShopifyProduct = async () => {
  const url = `https://${process.env.SHOPIFY_STORE}/admin/api/2024-10/graphql.json`;

  //   const mutation = `mutation CreateProductWithOptions($input: ProductInput!) {
  //     productCreate(input: $input) {
  //       userErrors {
  //         field
  //         message
  //       }
  //       product {
  //         id
  //         title
  //       }
  //     }
  //   }`;

  //   const variables = {
  //     input: {
  //       title: "Adult Basic Ball Cap Velcro",
  //       descriptionHtml:
  //         "<b>Blank Apparel:</b> <br>12 pieces per colour in assorted sizes. <br> <br><b>Custom Apparel:</b> <br>48 prints per design, which can be placed on an assortment of our garments meeting the following style minimums: <br>Short Sleeve Garments (Tees, Tanks) – 24 pieces per colour <br>Long Sleeve Garments (Hoodies, Crews, Long Sleeves) – 12 pieces per colour <br>Pants (Joggers, Shorts) – 12 pieces per colour <br> <br>*If your order does not meet the minimum, you will be contacted to revise it.",
  //       handle: "ABC : ABC-Black",
  //       productOptions: [
  //         {
  //           name: "Color",
  //           values: ["Black"],
  //         },
  //         {
  //           name: "Size",
  //           Values: "small",
  //         },
  //       ],
  //     },
  //   };
  //   const mutation = `
  //     mutation CreateProduct($input: ProductInput!) {
  //       productCreate(input: $input) {
  //         product {
  //           id
  //           title
  //           handle
  //         }
  //         userErrors {
  //           field
  //           message
  //         }
  //       }
  //     }
  //   `;

  //   const variables = {
  //     input: {
  //       title: "New Node.js Product",
  //       bodyHtml:
  //         "This is a product created via the Shopify GraphQL API using Node.js.",
  //       vendor: "Node.js Vendor",
  //       productType: "Widget",
  //       tags: ["Node.js", "GraphQL", "Shopify API"],
  //       variants: [
  //         {
  //           price: "19.99",
  //           sku: "NODE-001",
  //           inventoryQuantity: 100,
  //         },
  //       ],
  //     },
  //   };

  //   try {
  //     const response = await axios.post(
  //       url,
  //       { query },
  //       {
  //         headers: {
  //           "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     const product = response.data.data.productCreate.product;
  //     if (product) {
  //       console.log("Product created successfully:", product);
  //     } else {
  //       console.error(
  //         "Error creating product:",
  //         response.data.data.productCreate.userErrors
  //       );
  //     }
  //   } catch (error) {
  //     console.error(
  //       "Error creating product:",
  //       error.response ? error.response.data : error.message
  //     );
  //   }

  const mutation = `
  mutation {
     productCreate(input: {
         title: "New GraphQL Product"
         bodyHtml: "<strong>Great product!</strong>"
         vendor: "Your Vendor Name"
         tags: ["Tag4", "Tag5"]
         variants: [{
             title: "Default title"
             price: "19.99"
             sku: "SKU1234"
         }]
     }) {
         product {
             id
             title
         }
         userErrors {
             field
             message
         }
     }
 }
 `;

  try {
    const response = await axios.post(
      url,
    {query: mutation ,
      {
        headers: {
          "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Product created successfully:", response.data.product.id);
  } catch (error) {
    console.error(
      "Error creating product:",
      error.response ? error.response.data : error.message
    );
  }
};

createShopifyProduct();
