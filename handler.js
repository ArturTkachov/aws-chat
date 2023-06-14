'use strict';
const { DynamoDB } = require('aws-sdk');

const TableName = {
  UsersTable: 'UsersTable'
}

const dynamoDb = new DynamoDB();

module.exports.handler = async (event) => {
    console.log(event);
    const { routeKey, connectionId } = event.requestContext;

    if (routeKey === '$connect') {
      const params = {
        Item: {
          ClientId: {
            S: connectionId
          },
          IsOnline: {
            BOOL: true
          },
        },
        'TableName': TableName.UsersTable
      }
      await dynamoDb.putItem(params).promise();
    } else if (routeKey === '$disconnect') {
       const params = {
         ExpressionAttributeValues: {
         ":st": {
           BOOL: false
          },
        },
        Key: {
          ClientId: {
            S: connectionId
          },
        },
        ReturnValues: "ALL_NEW",
        TableName: TableName.UsersTable,
        UpdateExpression: "SET IsOnline = :st"
       };
       const data = await dynamoDb.updateItem(params).promise();
       console.log(data);
    } else if (routeKey === '$default') {

    }

    return { statusCode: 200 };
};
