"""Flask application factory.

Everything the app needs is wired up in create_app() so that tests, the dev
server, and gunicorn can all build the app the same way.
"""

from flask import Flask
from flask_cors import CORS

from .config import Config
from .routes import api


def create_app(config: type[Config] = Config) -> Flask:
    app = Flask(__name__)
    app.config.from_object(config)

    # Allow the frontend (running on a different origin) to call /api/*.
    CORS(app, resources={r"/api/*": {"origins": app.config["FRONTEND_ORIGIN"]}})

    app.register_blueprint(api, url_prefix="/api")

    return app
