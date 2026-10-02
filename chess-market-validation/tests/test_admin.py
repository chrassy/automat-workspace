import pytest
from fastapi.testclient import TestClient
from app.main import app

@pytest.fixture
def client():
    with TestClient(app) as test_client:
        yield test_client

def test_health_endpoint(client):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "chess-market-validation"

def test_landing_page_rendering_variants(client):
    # Test default
    res = client.get("/")
    assert res.status_code == 200
    assert "Ajedrez" in res.text
    assert "15 minutos al día" in res.text

    # Test variant B
    res_b = client.get("/?variant=B")
    assert res_b.status_code == 200
    assert "Masterclass + Tutor Inteligente" in res_b.text

    # Test variant C
    res_c = client.get("/?variant=C")
    assert res_c.status_code == 200
    assert "Ajedrez Educativo para Niños" in res_c.text

def test_admin_dashboard_rendering(client):
    response = client.get("/admin")
    assert response.status_code == 200
    assert "Panel de Validación y Analítica" in response.text
    assert "Simulador de Inversión" in response.text
    assert "Leads Registrados" in response.text
