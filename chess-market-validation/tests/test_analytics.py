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

def test_analytics_summary_calculation(client):
    # Add various leads
    client.post("/api/leads", json={"email": "usera1@test.com", "variant": "A", "elo_range": "800-1200", "willingness_to_pay": 29.0})
    client.post("/api/leads", json={"email": "usera2@test.com", "variant": "A", "elo_range": "800-1200", "willingness_to_pay": 29.0})
    client.post("/api/leads", json={"email": "userb1@test.com", "variant": "B", "elo_range": "1200-1600", "willingness_to_pay": 39.0})

    response = client.get("/api/analytics")
    assert response.status_code == 200
    data = response.json()
    assert data["total_leads"] >= 3
    assert data["leads_by_variant"]["A"] >= 2
    assert data["leads_by_variant"]["B"] >= 1
    assert "validation_status" in data
    assert "validation_score" in data
    assert isinstance(data["recommendations"], list)

def test_market_simulation_profitable(client):
    payload = {
        "ad_spend": 300.0,
        "cpc": 0.20,
        "landing_conversion_rate": 0.25,
        "preorder_conversion_rate": 0.10,
        "product_price": 29.0
    }
    response = client.post("/api/simulate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["estimated_clicks"] == 1500
    assert data["estimated_leads"] == 375
    assert data["estimated_buyers"] == 37
    assert data["estimated_revenue"] == 1073.0
    assert data["estimated_profit"] == 773.0
    assert data["roas"] == 3.58
    assert "Altamente Rentable" in data["verdict"]

def test_market_simulation_low_performance(client):
    payload = {
        "ad_spend": 500.0,
        "cpc": 0.50,
        "landing_conversion_rate": 0.10,
        "preorder_conversion_rate": 0.02,
        "product_price": 19.0
    }
    response = client.post("/api/simulate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["estimated_clicks"] == 1000
    assert data["estimated_leads"] == 100
    assert data["estimated_buyers"] == 2
    assert data["estimated_revenue"] == 38.0
    assert data["estimated_profit"] < 0
    assert data["roas"] < 1.0
    assert "Requiere Optimización" in data["verdict"]
