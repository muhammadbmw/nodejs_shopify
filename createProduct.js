require("dotenv").config();
const Shopify = require("shopify-api-node");

const shopify = new Shopify({
  shopName: process.env.SHOPIFY_STORE,
  accessToken: process.env.SHOPIFY_ACCESS_TOKEN,
});

const createProduct = async () => {
  let handle = "abc-Burg";
  let title = "Adult Basic Ball Cap Velcrocls";
  let size = "small";
  let colors = "Burgundy";
  let descriptionHtml =
    "<b>Blank Apparel:</b> <br>12 pieces per colour in assorted sizes. <br> <br><b>Custom Apparel:</b> <br>48 prints per design, which can be placed on an assortment of our garments meeting the following style minimums: <br>Short Sleeve Garments (Tees, Tanks) 24 pieces per colour <br>Long Sleeve Garments (Hoodies, Crews, Long Sleeves) 12 pieces per colour <br>Pants (Joggers, Shorts) 12 pieces per colour <br> <br>*If your order does not meet the minimum, you will be contacted to revise it.";

  // const mutation = `
  //     mutation {
  //       productCreate(input: {
  //         title: title,
  //         descriptionHtml: descriptionHtml
  //       })
  //       {
  //           product {
  //               id
  //               title
  //           }
  //           userErrors {
  //               field
  //               message
  //           }
  //       }
  //     }
  //   `;
  // const mutation = `
  //    mutation {
  //       productCreate(input: {
  //           title: "New GraphQL Product"
  //           bodyHtml: "<strong>Great product!</strong>"
  //           vendor: "Your Vendor Name"
  //           tags: ["Tag4", "Tag5"]
  //           variants: [{
  //               title: "Default title"
  //               price: "19.99"
  //               sku: "SKU1234"
  //           }]
  //       }) {
  //           product {
  //               id
  //               title
  //           }
  //           userErrors {
  //               field
  //               message
  //           }
  //       }
  //   }
  //   `;

  const query = `mutation createProduct($product: ProductInput!,$media: [CreateMediaInput!]) {
      productCreate(input: $product, media: $media) {
        userErrors {
          field
          message
        }
        product {
          id
          title

        }
      }
    }`;

  // send the GraphQL request

  const variables = {
    product: {
      title,
      descriptionHtml,
      handle,
      options: ["Size", "Color"],
      variants: [
        {
          //               title: "Default title"
          price: "19.99",
          sku: "SKU1234",
          options: ["Small", "Black"],
          // inventoryQuantity: 123,
        },
      ],
      // productOptions: [
      //   {
      //     name: "Color",
      //     position: 1,
      //     values: [{ name: "Black" }],
      //   },
      //   {
      //     name: "Size",
      //     position: 2,
      //     Values: [{ name: "small" }],
      //   },
      // ],
    },
    media: [
      {
        originalSource:
          "https://www.dl.dropboxusercontent.com/scl/fi/89weltbxaktkitl1l7xoj/SM-MUG93079_04_360_01.jpg?rlkey=es3846kkglzj6vwzjgyfxt0qr&e=1&st=wmmx15wg&dl=0",
        alt: "Test image upload",
        mediaContentType: "IMAGE",
      },
    ],
  };

  try {
    const response = await shopify.graphql(query, variables);
    console.log("Product created:", JSON.stringify(response, null, 2));
  } catch (error) {
    console.error("Error creating product:", error);
  }
};

createProduct();
