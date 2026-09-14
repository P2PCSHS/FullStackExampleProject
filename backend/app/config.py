"""Configuration, read from environment variables.

Copy .env.example to .env at the repo root and edit it to change these.
"""

import os


class Config:
    # Origin(s) allowed to call the API. "*" is fine for local dev; set it to
    # your real frontend URL in production.
    FRONTEND_ORIGIN = os.environ.get("FRONTEND_ORIGIN", "*")
