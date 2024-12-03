// require("dotenv").config();
// const Shopify = require("shopify-api-node");

// cls

const shopify = require("./shopifyConfig");

const query = `query {
    products(first: 10, reverse: true) {
      edges {
        node {
          id
          title
          handle
          description
        }
      }
    }
  }
`;

const transformResponse = (data) => {
  return {
    products: data.products.edges.map((productEdge) => {
      const productNode = productEdge.node;
      return {
        id: productNode.id.replace("gid://shopify/Product/", ""),
        title: productNode.title,
        handle: productNode.handle,
        description: productNode.description,
      };
    }),
  };
};

const fetchProducts = async () => {
  try {
    // const products = await shopify.product.list();
    const products = await shopify.graphql(query);
    console.log(JSON.stringify(products, null, 2));
    const simplifiedResponse = transformResponse(products);
    console.log(simplifiedResponse);
  } catch (error) {
    console.log(error);
  }
};
fetchProducts();
