import json
import traceback
import sys


def _build_app():
    from mangum import Mangum
    from app.main import app
    return Mangum(app, lifespan="off")


def handler(event, context):
    try:
        mangum_handler = _build_app()
        return mangum_handler(event, context)
    except Exception:
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({
                "error": traceback.format_exc(),
                "python_version": sys.version,
            })
        }
