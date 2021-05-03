import AWS from 'aws-sdk';
import commonMiddleware from '../lib/commonMiddleware';
import createError from 'http-errors';


const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getAuctions(event, context) {
  let auctions;

  try {
    const result = await dynamodb.scan({  // not advisable to use scan in real app as it is slower and consumes more resources, use query instead
      TableName: process.env.AUCTIONS_TABLE_NAME
    }).promise();

    auctions = result.Items;
  } catch (error) {
  console.log("🚀 ~ file: getAuctions.js ~ line 17 ~ getAuctions ~ error", error);
    throw new createError.InternalServerError(error); // not advisable to reveal errors in production, only good for debugging
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ auctions }),
  };
}

export const handler = commonMiddleware(getAuctions);
