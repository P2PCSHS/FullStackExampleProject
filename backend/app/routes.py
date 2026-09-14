"""API routes.

Add new endpoints here, or create more blueprints as the project grows.
"""

from flask import Blueprint, jsonify

api = Blueprint("api", __name__)


@api.get("/hello")
def hello():
    return jsonify({"message": "Hello from Flask!"})


@api.get("/health")
def health():
    """Used by Docker and the deploy script to check the backend is up."""
    return jsonify({"status": "ok"})
