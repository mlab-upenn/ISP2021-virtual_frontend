from aws_utils import AWSUtils
import os
import json

def handler(event, context):

  utils = AWSUtils()
  items = utils.dynamo_scan('races-staging')

  return {
      'statusCode': 200,
      'headers': {
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
      },
      'body': json.dumps(items)
  }
