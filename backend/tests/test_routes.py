import pytest

from app import create_app


@pytest.fixture
def client():
    app = create_app()
    app.config["TESTING"] = True
    return app.test_client()


def test_hello(client):
    response = client.get("/api/hello")
    assert response.status_code == 200
    assert response.get_json() == {"message": "Hello from Flask!"}


def test_health(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.get_json()["status"] == "ok"
