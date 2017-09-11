const uuidv4 = require('uuid/v4');

const AWS = require('aws-sdk');
AWS.config.update({region: 'eu-west-1'});
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
    const meetingId = event.pathParameters.id;

    var params = {
        TableName : 'MeetingCostMeetings',
        Key: {
          ID: meetingId
        },
        AttributeUpdates: {
            Started: {
                Action: 'PUT',
                Value: (new Date()).toString()
            }
        }
    };

    dynamodb.update(params, function(err, data) {
        if (err) {
            console.log(err);

            const result = {
                "isBase64Encoded": false,
                "statusCode": 500,
                "headers": { 
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                }
            };

            callback(null, result);
        }
        else {
            console.log(data);

            const result = {
                "isBase64Encoded": false,
                "statusCode": 200,
                "headers": { 
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                }
            };

            callback(null, result);
        }
    });
};