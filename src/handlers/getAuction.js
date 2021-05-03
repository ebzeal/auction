import AWS from 'aws-sdk';
import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpErrorHandler from "@middy/http-error-handler";
import createError from 'http-errors';


const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getAuction(event, context) {
 let auction;
 const { id } = event.pathParameters;

 try {
   const result = await dynamodb.get({
     TableName: process.env.AUCTIONS_TABLE_NAME,
     Key: { id }
   }).promise();

   auction = result.Item;
 } catch (error) {
 console.log("🚀 ~ file: getAuction.js ~ line 17 ~ getAuction ~ error", error);
   throw new createError.InternalServerError(error);
 }

 if(!auction) {
   throw new createError.NotFound(`Auction with ID "${id}" not found`);
 }

  return {
    statusCode: 200,
    body: JSON.stringify({ auction }),
  };
}

export const handler = middy(getAuction)
  .use(httpJsonBodyParser())    // this parses our strings in the body hence we can remove JSON.parse from event.body
  .use(httpEventNormalizer())  // it will prevent us from having none existing objects to reduce errors and if statements
  .use(httpErrorHandler());  // helps handle our errors


