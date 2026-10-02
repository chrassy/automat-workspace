import pytest
from fastapi.testclient import TestClient
from app.main import app

@pytest.fixture
def client():
    with TestClient(app) as test_client:
        yield test_client

def test_list_puzzles(client):
    response = client.get("/api/puzzles")
    assert response.status_code == 200
    puzzles = response.json()
    assert len(puzzles) >= 3
    assert "puzzle-1" in [p["id"] for p in puzzles]
    assert "Mate del Pasillo" in puzzles[0]["title"]

def test_verify_puzzle_solution_correct(client):
    # Correct moves
    res1 = client.post("/api/puzzles/verify", json={"puzzle_id": "puzzle-1", "move": "Rb8#"})
    assert res1.status_code == 200
    assert res1.json()["correct"] is True
    assert "Excelente" in res1.json()["message"]

    res2 = client.post("/api/puzzles/verify", json={"puzzle_id": "puzzle-1", "move": "tb8"})
    assert res2.status_code == 200
    assert res2.json()["correct"] is True

def test_verify_puzzle_solution_incorrect(client):
    res = client.post("/api/puzzles/verify", json={"puzzle_id": "puzzle-1", "move": "Ra1"})
    assert res.status_code == 200
    assert res.json()["correct"] is False
    assert "no es la mejor jugada" in res.json()["message"]

def test_verify_nonexistent_puzzle(client):
    res = client.post("/api/puzzles/verify", json={"puzzle_id": "unknown-puzzle", "move": "e4"})
    assert res.status_code == 200
    assert res.json()["correct"] is False
    assert "no encontrado" in res.json()["message"]
