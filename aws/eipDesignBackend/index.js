const {
  AWS_REGION,
  AWS_LAMBDA_FUNCTION_NAME = 'Unegma_PriceMonitor',
  // AWS_TIMEOUT_THRESHOLD
  SLACK_ERROR_LOG, // NEED ENVIRONMENT VARIABLES FOR THOSE USED IN IMPORTS
  SLACK_EIPDESIGN_MESSAGES,
} = process.env;

const { AWSUtilities } = require('@unegma/aws-utilities');
const { SlackErrorLogger, SlackLogger } = require('@unegma/logger');
const slackErrorLogger = new SlackErrorLogger(SLACK_ERROR_LOG);
const slackMessageLogger = new SlackLogger(SLACK_EIPDESIGN_MESSAGES);
const awsUtilities = new AWSUtilities(AWS_REGION, SLACK_ERROR_LOG);

/**
 *
 * @param event
 * @param context
 * @returns {Promise<{body: string, statusCode: number}>}
 */
exports.handler = async (event, context) => {
  console.log(`# Beginning ${AWS_LAMBDA_FUNCTION_NAME}`); console.log(JSON.stringify(event)); console.log(context);

  let message = "# Success";
  try {

    console.log('here');
    console.log(`The message: ${message}`);

    await slackMessageLogger.log('Unegma_PriceMonitor', JSON.stringify(event.body));

  } catch(error) {
    message = error.message;
    await slackErrorLogger.logError('handler', `${AWS_LAMBDA_FUNCTION_NAME} failed.`, error);
  }
  console.log(`Completed ${AWS_LAMBDA_FUNCTION_NAME}`);

  // Access-Control-Allow-Credentials needs to be set also to 'true' on the cors enabled resource
  return {
    headers: {
      "Content-Type" : "application/json",
      "Access-Control-Allow-Headers" : "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
      "Access-Control-Allow-Methods" : "OPTIONS,POST,GET,PUT,PATCH,DELETE", // HEAD?
      "Access-Control-Allow-Credentials" : true, // Required for cookies, authorization headers with HTTPS
      "Access-Control-Allow-Origin" : "*",
      "X-Requested-With" : "*"
    },
    statusCode: 200,
    // body: JSON.stringify(response)
    body: message
  };
};

/**
 * Handler Functions
 */

/**
 * Sub Functions
 */
