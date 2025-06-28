
import base64
import json
from PIL import Image
import io

def lambda_handler(event, context):
    try:
        # Extract bucket & object name
        bucket = event["Records"][0]["s3"]["bucket"]["name"]
        key = event["Records"][0]["s3"]["object"]["key"]

        import boto3
        s3 = boto3.client("s3")
        file_obj = s3.get_object(Bucket=bucket, Key=key)
        image_data = file_obj["Body"].read()

        # Convert to image
        image = Image.open(io.BytesIO(image_data))

        # --- Your ML Logic Here ---
        # Let's say it returns this for now
        result = {
            "plant": "Basil",
            "status": "Needs Water",
            "waterNeeded": "200ml recommended"
        }

        # Save result to S3 as JSON
        result_key = key.replace(".jpg", ".json")
        s3.put_object(
            Bucket=bucket,
            Key=result_key,
            Body=json.dumps(result),
            ContentType="application/json"
        )

        return {
            "statusCode": 200,
            "body": json.dumps("Success")
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps(f"Error: {str(e)}")
        }
