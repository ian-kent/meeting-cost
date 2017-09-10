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
        }
    };

    dynamodb.get(params, function(err, data) {
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

            if (!data.hasOwnProperty("Item")) {
                const result = {
                    "isBase64Encoded": false,
                    "statusCode": 404,
                    "headers": { 
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*"
                    }
                };
    
                callback(null, result);

                return;
            }

            const meeting = {
                id: meetingId,
                name: data.Item.Name,
                created: data.Item.Created,
                user: {
                    name: data.Item.User.name,
                    rate: data.Item.User.rate,
                    id: data.Item.User.id
                }
            }

            const result = {
                "isBase64Encoded": false,
                "statusCode": 200,
                "headers": { 
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
                "body": JSON.stringify(meeting)
            };

            callback(null, result);
        }
    });
};