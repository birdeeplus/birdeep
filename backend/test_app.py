# test_app.py

import pytest
import json
from app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    client = app.test_client()
    yield client


# ========================
# Pruebas de diagnostics
# ========================

diagnostic_data = {
    "id_record": 1,
    "time_executed": "2025-01-01 12:00:00",
    "used_model": "test_model",
    "model_version": "1.0",
    "pretreatment": "none",
    "created_by": "test_user"
}

updated_diagnostic_data = {
    "used_model": "updated_model",
    "model_version": "2.0"
}

@pytest.fixture
def client():
    app.config['TESTING'] = True
    client = app.test_client()
    yield client

# Test: Insertar un nuevo diagnóstico
def test_insert_new_diagnostic(client):
    response = client.post("/api/v1/diagnostics", data=json.dumps(diagnostic_data), content_type="application/json")
    assert response.status_code == 200
    assert response.json["message"] == "Registro creado correctamente"

# Test: Obtener todos los diagnósticos
def test_query_diagnostics(client):
    response = client.get("/api/v1/diagnostics")
    assert response.status_code == 200
    assert isinstance(response.json, list)  # Se espera una lista de resultados

# Test: Actualizar un diagnóstico existente 
def test_update_diagnostic(client):
    diagnostic_id = 1  # ID que existe en la BD
    response = client.put(f"/api/v1/diagnostics/{diagnostic_id}", data=json.dumps(updated_diagnostic_data), content_type="application/json")
    assert response.status_code == 200
    assert response.json["message"] == "Registro actualizado correctamente"

# Test: Eliminar un diagnóstico
def test_delete_diagnostic(client):
    diagnostic_id = 1  # ID que existe en la BD
    response = client.delete(f"/api/v1/diagnostics/{diagnostic_id}")
    assert response.status_code == 200
    assert response.json["message"] == "Elemento eliminado correctamente"



# ========================
# Pruebas de download_recordings
# ========================





# ========================
# Pruebas de insert_files
# ========================




# ========================
# Pruebas de locations
# ========================



# ========================
# Pruebas de log_recorders
# ========================



# ========================
# Pruebas de login
# ========================



# ========================
# Pruebas de microphones
# ========================



# ========================
# Pruebas de processors
# ========================



# ========================
# Pruebas de recorders
# ========================



# ========================
# Pruebas de recordings
# ========================



# ========================
# Pruebas de sing_events
# ========================



# ========================
# Pruebas de species
# ========================


# ========================
# Pruebas de upload_singevent
# ========================






# def test_upload_file(client):
#     data = {
#         "json_data": json.dumps({
#             "file1": { "id_recorder_record": "12345" }
#         })
#     }

#     file_path = "test-audio.wav"
#     with open(file_path, "wb") as f:
#         f.write(b"Contenido de prueba")  # Crear archivo de prueba

#     with open(file_path, "rb") as f:
#         response = client.post(
#             "/api/archivos/subir",
#             data={**data, "file1": f},
#             content_type="multipart/form-data"
#         )

#     assert response.status_code == 200
#     assert response.json["message"] == "Archivos almacenados correctamente"
