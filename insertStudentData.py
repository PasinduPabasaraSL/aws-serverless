import json
import boto3

def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb', region_name='ap-southeast-1')
    table = dynamodb.Table('studentData')

    student_id = event.get('studenid') or event.get('studentid')
    if not student_id:
        return {
            "statusCode": 400,
            "body": json.dumps({"error": "Missing studentid or studenid"})
        }

    item = {
        "studenid": student_id,
        "name": event.get("name", ""),
        "class": event.get("class", ""),
        "age": event.get("age", "")
    }

    table.put_item(Item=item)

    return {
        "statusCode": 200,
        "body": json.dumps({
            "message": "Item inserted successfully",
            "data": item
        })
    }
