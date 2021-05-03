import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpErrorHandler from "@middy/http-error-handler";
import middy from '@middy/core';


export default handler => middy(handler)
 .use([
   httpJsonBodyParser(), // this parses our strings in the body hence we can remove JSON.parse from event.body
   httpEventNormalizer(), // it will prevent us from having none existing objects to reduce errors and if statements
   httpErrorHandler(), // helps handle our errors
 ]);