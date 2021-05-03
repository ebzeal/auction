import {v4 as uuid} from 'uuid';
import AWS from 'aws-sdk';
import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpErrorHandler from "@middy/http-error-handler";
import createError from 'http-errors';


const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createAuction(event, context) {
  const {title} = event.body;
  const now = new Date();

const auction = {
  id: uuid(),
  title,
  status: 'OPEN',
  createdAt: now.toISOString(),
};

try {
  await dynamodb.put({
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Item: auction,
  }).promise();
} catch (error) {
console.log("🚀 ~ file: createAuction.js ~ line 29 ~ createAuction ~ error", error);
  throw new createError.InternalServerError(Error);
}


  return {
    statusCode: 201,
    body: JSON.stringify({ auction }),
  };
}

export const handler = middy(createAuction)
  .use(httpJsonBodyParser())    // this parses our strings in the body hence we can remove JSON.parse from event.body
  .use(httpEventNormalizer())  // it will prevent us from having none existing objects to reduce errors and if statements
  .use(httpErrorHandler());  // helps handle our errors


