import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import pytest
from app import app

@pytest.fixture
def client():
    with app.test_client() as client:
        yield client

def test_home(client):
    """Test the home page."""
    rv = client.get('/')
    assert rv.status_code == 200
    assert b'OK' in rv.data


def test_sst_no_file(client):
    """Test the speech-to-text endpoint with no file."""
    rv = client.post('/api/sst/en')
    assert rv.status_code == 400
    assert b"Erro ao receber o arquivo!" in rv.data


def test_tts_no_data(client):
    """Test the text-to-speech endpoint with no data."""
    rv = client.post('/api/audio/en', json={})
    assert rv.status_code == 400
    assert b"Parametro data ausente na solicitacao" in rv.data


def test_llm_no_request(client):
    """Test the LLM endpoint with no request data."""
    rv = client.post('/api/generate/', json={})
    assert rv.status_code == 400
    assert b"Parametros invalidos!" in rv.data