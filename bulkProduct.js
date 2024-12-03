require("dotenv").config();
const axios = require("axios");
const Shopify = require("shopify-api-node");
const parseString = require("xml2js").parseString;
const fs = require("fs");

const shopify = new Shopify({
  shopName: process.env.SHOPIFY_STORE,
  accessToken: process.env.SHOPIFY_ACCESS_TOKEN,
});
const bulkProduct = async () => {
  const staged_upload_query = `
    mutation {
    stagedUploadsCreate(input:{
        resource: BULK_MUTATION_VARIABLES,
        filename: "products.jsonl",
        mimeType: "text/jsonl",
        httpMethod: POST
    }){
        userErrors{
        field,
        message
        },
        stagedTargets{
        url,
        resourceUrl,
        parameters {
            name,
            value
        }
        }
    }
    }`;

  try {
    const response = await shopify.graphql(staged_upload_query);
    let url = response.stagedUploadsCreate.stagedTargets[0].url;
    let key = response.stagedUploadsCreate.stagedTargets[0].parameters[3].value;
    let xgoogdate =
      response.stagedUploadsCreate.stagedTargets[0].parameters[4].value;
    let xgoogcredential =
      response.stagedUploadsCreate.stagedTargets[0].parameters[5].value;
    let xgoogalgorithm =
      response.stagedUploadsCreate.stagedTargets[0].parameters[6].value;
    let xgoogsignature =
      response.stagedUploadsCreate.stagedTargets[0].parameters[7].value;
    let policy =
      response.stagedUploadsCreate.stagedTargets[0].parameters[8].value;

    //console.log("Stage Upload:", JSON.stringify(response, null, 2));

    // let filePath = __dirname + "/products.jsonl";

    let formData = new FormData();
    formData.append("key", key);
    formData.append("x-goog-credential", xgoogcredential);
    formData.append("x-goog-algorithm", xgoogalgorithm);
    formData.append("x-goog-date", xgoogdate);
    formData.append("x-goog-signature", xgoogsignature);
    formData.append("policy", policy);
    formData.append("acl", "private");
    formData.append("Content-Type", "text/jsonl");
    formData.append("success_action_status", "201");

    const buffer = fs.readFileSync("./products.jsonl");
    const blob = new Blob([buffer]);
    const myFile = new File([blob], "products.jsonl");

    formData.append("file", myFile);

    //upload the josnl file
    try {
      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      let parseData;
      parseString(response.data, (err, result) => {
        parseData = result;
      });

      const product_create_query = `mutation {
                bulkOperationRunMutation(
                mutation: "mutation call($input: ProductInput!) { productCreate(input: $input) { product {title productType vendor} userErrors { message field } } }",
                stagedUploadPath: "${parseData.PostResponse.Key[0]}") {
                bulkOperation {
                  id
                  url
                  status
                }
                userErrors {
                  message
                  field
                }
              }
            }`;

      try {
        const bulkResponse = await shopify.graphql(product_create_query);
        console.log(JSON.stringify(bulkResponse, null, 2));
      } catch (error) {
        console.error(error);
      }
    } catch (error) {
      console.error(error);
    }
  } catch (error) {
    console.error("Error stage upload:", error);
  }
};
bulkProduct();
