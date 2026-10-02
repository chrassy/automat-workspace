import pytest
import tempfile
import os
from fastapi.testclient import TestClient
from app.database import init_db
from app.main import app

@pytest.fixture
def client(monkeypatch):
    with tempfile.NamedTemporaryFile(suffix=".db", delete=False) as tmp:
        test_db_path = tmp.name

    monkeypatch.setenv("CHESS_DB_PATH", test_db_path)
    init_db(test_db_path)

    with TestClient(app) as test_client:
        yield test_client

    if os.path.exists(test_db_path):
        os.remove(test_db_path)

def test_create_lead_success(client):
    payload = {
        "email": "test.user@example.com",
        "name": "Test User",
        "variant": "A",
        "elo_range": "800-1200",
        "main_frustration": "Colgadas en partidas rápidas",
        "interested_tier": "course_29",
        "willingness_to_pay": 29.0,
        "preferred_format": "interactive_app",
        "utm_source": "instagram_ads",
        "utm_campaign": "dolor_elo"
    }
    response = client.post("/api/leads", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "test.user@example.com"
    assert data["variant"] == "A"
    assert data["willingness_to_pay"] == 29.0
    assert "id" in data

def test_create_duplicate_lead_fails(client):
    payload = {
        "email": "duplicate@example.com",
        "name": "Carlos",
        "variant": "B"
    }
    res1 = client.post("/api/leads", json=payload)
    assert res1.status_code == 201

    res2 = client.post("/api/leads", json=payload)
    assert res2.status_code == 409
    assert "ya está registrado" in res2.json()["detail"]

def test_create_invalid_email_fails(client):
    payload = {
        "email": "not-an-email",
        "name": "Invalid"
    }
    response = client.post("/api/leads", json=payload)
    assert response.status_code == 422

def test_list_leads_filter_by_variant(client):
    client.post("/api/leads", json={"email": "leada1@test.com", "variant": "A"})
    client.post("/api/leads", json={"email": "leada2@test.com", "variant": "A"})
    client.post("/api/leads", json={"email": "leadb1@test.com", "variant": "B"})

    res_all = client.get("/api/leads")
    assert res_all.status_code == 200
    assert len(res_all.json()) >= 3

    res_b = client.get("/api/leads?variant=B")
    assert res_b.status_code == 200
    for l in res_b.json():
        assert l["variant"] == "B"

def test_export_leads_csv(client):
    client.post("/api/leads", json={"email": "csvuser@test.com", "name": "CSV User", "variant": "C"})
    response = client.get("/api/export/csv")
    assert response.status_code == 200
    assert "text/csv" in response.headers["content-type"]
    assert "csvuser@test.com" in response.text
    assert "email,name,variant" in response.text
