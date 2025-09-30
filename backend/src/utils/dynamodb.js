import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand, DeleteCommand, ScanCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'ap-northeast-2' });
const docClient = DynamoDBDocumentClient.from(client);

export const dynamodb = {
  get: async (tableName, key) => {
    const command = new GetCommand({
      TableName: tableName,
      Key: key,
    });
    const response = await docClient.send(command);
    return response.Item;
  },

  put: async (tableName, item) => {
    const command = new PutCommand({
      TableName: tableName,
      Item: item,
    });
    await docClient.send(command);
    return item;
  },

  update: async (tableName, key, updates) => {
    const updateExpression = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};

    Object.keys(updates).forEach((field, index) => {
      updateExpression.push(`#field${index} = :value${index}`);
      expressionAttributeNames[`#field${index}`] = field;
      expressionAttributeValues[`:value${index}`] = updates[field];
    });

    const command = new UpdateCommand({
      TableName: tableName,
      Key: key,
      UpdateExpression: `SET ${updateExpression.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW',
    });

    const response = await docClient.send(command);
    return response.Attributes;
  },

  delete: async (tableName, key) => {
    const command = new DeleteCommand({
      TableName: tableName,
      Key: key,
    });
    await docClient.send(command);
  },

  scan: async (tableName) => {
    const command = new ScanCommand({
      TableName: tableName,
    });
    const response = await docClient.send(command);
    return response.Items || [];
  },

  query: async (tableName, indexName, keyConditionExpression, expressionAttributeNames, expressionAttributeValues) => {
    const command = new QueryCommand({
      TableName: tableName,
      IndexName: indexName,
      KeyConditionExpression: keyConditionExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
    });
    const response = await docClient.send(command);
    return response.Items || [];
  },
};