import boto3
from boto3.dynamodb.conditions import Key, Attr


class AWSUtils:
    dynamo_db = boto3.resource('dynamodb')

    @classmethod
    def dynamo_get(cls, table_name, id):
        table = cls.dynamo_db.Table(table_name)
        response = table.get_item(Key={'id': id})
        return response['Item']

    @classmethod
    def dynamo_put(cls, table_name, obj):
        table = cls.dynamo_db.Table(table_name)
        table.put_item(Item=obj)
        return

    @classmethod
    def dynamo_scan(cls, table_name, filter_expression=None, index=None):
        table = cls.dynamo_db.Table(table_name)
        scan_kwargs = {}
        if filter_expression:
            scan_kwargs['FilterExpression'] = filter_expression

        items = []
        done = False
        last_evaluated_key = None
        while not done:
            if last_evaluated_key:
                scan_kwargs['ExclusiveStartKey'] = last_evaluated_key
            response = table.scan(**scan_kwargs)
            items.extend(response.get('Items', []))
            last_evaluated_key = response.get('LastEvaluatedKey', None)
            done = last_evaluated_key is None

        return items

    @classmethod
    def dynamo_query(cls, table_name, key_condition_expression):
        '''
        key_condition_expression in Key(key).eq(value) form
        '''

        table = cls.dynamo_db.Table(table_name)
        response = table.query(KeyConditionExpression=key_condition_expression)
        return response['Items']

    @classmethod
    def s3_get(cls, bucket, key):
        pass
