import AWS from 'aws-sdk';
import commonMiddleware from '../lib/commonMiddleware';
import createError from 'http-errors';


const dynamodb = new AWS.DynamoDB.DocumentClient();

export async function getAuctionBiId(id){
  let auction;
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
 return auction;
}

async function getAuction(event, context) {
 let auction;
 const { id } = event.pathParameters;
 auction = await getAuctionBiId(id);
 return {
    statusCode: 200,
    body: JSON.stringify({ auction }),
  };
}

export const handler = commonMiddleware(getAuction);

