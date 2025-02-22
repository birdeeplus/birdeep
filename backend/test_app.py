import pytest
import json
from app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    client = app.test_client()
    yield client

def test_upload_file(client):
    data = {
        "json_data": json.dumps({
            "file1": { "id_recorder_record": "12345" }
        })
    }

    file_path = "test-audio.wav"
    with open(file_path, "wb") as f:
        f.write(b"Contenido de prueba")  # Crear archivo de prueba

    with open(file_path, "rb") as f:
        response = client.post(
            "/api/archivos/subir",
            data={**data, "file1": f},
            content_type="multipart/form-data"
        )

    assert response.status_code == 200
    assert response.json["message"] == "Archivos almacenados correctamente"
