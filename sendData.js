const sendDataToShopify = (data) => {
  let handle = data.Name;
  let title = data["Display Name"];
  let size = data["NRT sizes"];
  let colors = data["NRT Colors"];
  let descriptionHtml = data["Store Description"];
  //console.log(handle, title, size, colors, descriptionHtml);

  const input = {
    title,
    descriptionHtml,
    handle,
  };

  const mutation = `mutation CreateProductWithOptionsMedia($input: ProductInput!) {
      productCreate(input: $input) {
        userErrors {
          field
          message
        }
        product {
          id
         
          }
         
        }
      }
    }`;
};
module.exports = sendDataToShopify;
