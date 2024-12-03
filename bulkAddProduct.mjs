import { createAdminApiClient } from "@shopify/admin-api-client";
import * as fs from "fs";

// Authentication
const client = createAdminApiClient({
  storeDomain: "canada-custom-merchandise.myshopify.com",
  apiVersion: "2024-10",
  accessToken: "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",
});

const createUploadUrlMutation = `
    mutation {
    stagedUploadsCreate(input:{
        resource: BULK_MUTATION_VARIABLES,
        filename: "bulk_op_vars",
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
    }
`;

const createUploadUrlMutationResult = await client.request(
  createUploadUrlMutation
);

//console.log(JSON.stringify(createUploadUrlMutationResult, null, 2));

const url =
  createUploadUrlMutationResult?.data?.stagedUploadsCreate.stagedTargets[0].url;

const formData = new FormData();

createUploadUrlMutationResult?.data?.stagedUploadsCreate.stagedTargets[0].parameters.forEach(
  (param) => {
    formData.append(param.name, param.value);
  }
);

// formData.append("file", fs.createReadStream("./products.jsonl"));
const buffer = fs.readFileSync("./products.jsonl");
const blob = new Blob([buffer]);
const myFile = new File([blob], "products.jsonl");

formData.append("file", myFile);

// // Upload Update File
const uploadUrlResult = await fetch(url, {
  method: "POST",
  body: formData,
});

const resultXml = await uploadUrlResult.text();

const regex = /<Key>(.*?)<\/Key>/;
const stagedUploadPath = resultXml.match(regex)[1];

const createProductsMutation = `
mutation {
  bulkOperationRunMutation(
    mutation: "mutation call($input: ProductInput!) { productCreate(input: $input) { product {id title variants(first: 10) {edges {node {id title inventoryQuantity }}}} userErrors { message field } } }",
    stagedUploadPath: "${stagedUploadPath}") {
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
}

`;

const { data, errors } = await client.request(createProductsMutation);

console.log(data);
console.log(errors);
