import json
import boto3

def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb', region_name='ap-southeast-1')
    table = dynamodb.Table('studentData')

    try:
        response = table.scan()
        items = response.get('Items', [])

        while 'LastEvaluatedKey' in response:
            response = table.scan(ExclusiveStartKey=response['LastEvaluatedKey'])
            items.extend(response.get('Items', []))

        normalized = [{
            "studentid": item.get("studenid") or item.get("studentid"),
            "name": item.get("name"),
            "class": item.get("class"),
            "age": item.get("age")
        } for item in items]

        return {
            "isBase64Encoded": False,
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            },
            "body": json.dumps(normalized)
        }

    except Exception as e:
        print("Error:", str(e))
        return {
            "isBase64Encoded": False,
            "statusCode": 500,
            "headers": {
                "Access-Control-Allow-Origin": "*"
            },
            "body": json.dumps({
                "message": "Error retrieving student data",
                "error": str(e)
            })
        }
