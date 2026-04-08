try:
    from mangum import Mangum
    from app.main import app
    handler = Mangum(app, lifespan="off")
except Exception as e:
    import json
    import traceback
    error_msg = traceback.format_exc()
    def handler(event, context):
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"error": str(e), "trace": error_msg})
        }
