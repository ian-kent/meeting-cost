const uuidv4 = require('uuid/v4');

const AWS = require('aws-sdk');
AWS.config.update({region: 'eu-west-1'});
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
    const input = JSON.parse(event.body);
    const id = uuidv4();

    const meeting = {
        id: id,
        name: input.name,
        user: input.user,
        created: (new Date()).toString()
    }

    let result = {
        "isBase64Encoded": false,
        "statusCode": 201,
        "headers": { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        },
        "body": JSON.stringify(meeting)
    };

    var params = {
        Item: {
         "ID": meeting.id,
         "Name": meeting.name,
         "User": meeting.user,
         "Created": meeting.created
        }, 
        TableName: "MeetingCostMeetings"
    };
    dynamodb.put(params, function(err, data) {
        if (err) {
            console.log(err, err.stack);
            result.statusCode = 500;
            result.body = "{}";
            callback(null, result);
        }
        else {
            console.log(data);
            callback(null, result);
        }
    });
};