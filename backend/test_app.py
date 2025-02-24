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

# diagnostic_data = {
#     "id_record": 1,
#     "time_executed": "2025-01-01 12:00:00",
#     "used_model": "test_model",
#     "model_version": "1.0",
#     "pretreatment": "none",
#     "created_by": "test_user"
# }

# updated_diagnostic_data = {
#     "used_model": "updated_model",
#     "model_version": "2.0"
# }

# @pytest.fixture
# def client():
#     app.config['TESTING'] = True
#     client = app.test_client()
#     yield client

# # Test: Insertar un nuevo diagnóstico
# def test_insert_new_diagnostic(client):
#     response = client.post("/api/v1/diagnostics", data=json.dumps(diagnostic_data), content_type="application/json")
#     assert response.status_code == 200
#     assert response.json["message"] == "Registro creado correctamente"

# # Test: Obtener todos los diagnósticos
# def test_query_diagnostics(client):
#     response = client.get("/api/v1/diagnostics")
#     assert response.status_code == 200
#     assert isinstance(response.json, list)  # Se espera una lista de resultados

# # Test: Actualizar un diagnóstico existente 
# def test_update_diagnostic(client):
#     diagnostic_id = 1  # ID que existe en la BD
#     response = client.put(f"/api/v1/diagnostics/{diagnostic_id}", data=json.dumps(updated_diagnostic_data), content_type="application/json")
#     assert response.status_code == 200
#     assert response.json["message"] == "Registro actualizado correctamente"

# # Test: Eliminar un diagnóstico
# def test_delete_diagnostic(client):
#     diagnostic_id = 1  # ID que existe en la BD
#     response = client.delete(f"/api/v1/diagnostics/{diagnostic_id}")
#     assert response.status_code == 200
#     assert response.json["message"] == "Elemento eliminado correctamente"



# ========================
# Pruebas de download_recordings
# ========================





# ========================
# Pruebas de insert_files
# ========================




# ========================
# Pruebas de locations
# ========================

# location_data = {
#     "name_location": "Test Location",
#     "latitude_location": 40.7128,
#     "longitude_location": -74.0060,
#     "habitat_location": "Forest"
# }

# updated_location_data = {
#     "name_location": "Updated Test Location",
#     "latitude_location": 41.0000,
#     "longitude_location": -75.0000,
#     "habitat_location": "Desert"
# }

# # Test: Insertar una nueva ubicación
# def test_insert_new_location(client):
#     response = client.post("/api/v1/locations", data=json.dumps(location_data), content_type="application/json")
#     assert response.status_code == 200
#     assert response.json["message"] == "Registro creado correctamente"

# # Test: Obtener todas las ubicaciones
# def test_query_locations(client):
#     response = client.get("/api/v1/locations")
#     assert response.status_code == 200
#     assert isinstance(response.json, list)  

# # Test: Actualizar una ubicación existente
# def test_update_location(client):
#     location_id = 1  # Suponiendo que la ubicación con ID 1 existe
#     response = client.put(f"/api/v1/locations/{location_id}", data=json.dumps(updated_location_data), content_type="application/json")
#     assert response.status_code == 200
#     assert response.json["message"] == "Registro actualizado correctamente"

# # Test: Eliminar una ubicación
# def test_delete_location(client):
#     location_id = 1  # Suponiendo que la ubicación con ID 1 existe
#     response = client.delete(f"/api/v1/locations/{location_id}")
#     assert response.status_code == 200
#     assert response.json["message"] == "Elemento eliminado correctamente"



# ========================
# Pruebas de log_recorders
# ========================

# log_status_data = {
#     "id_recorder_log": 1,
#     "status": "active",
#     "battery_level": 85,
#     "signal_strength": 75,
#     "last_update": "2025-02-24 12:00:00"
# }

# # Test: Test para insertar un nuevo log status
# def test_insert_status(client):
#     response = client.post("/insert_status", data=json.dumps(log_status_data), content_type="application/json")

#     assert response.status_code == 200
#     assert "message" in response.json
#     assert response.json["message"] == "Registro creado correctamente"



# ========================
# Pruebas de login
# ========================

# # Credenciales correctas
# valid_credentials = {
#     "username": "user",
#     "password": "password"
# }

# # Credenciales incorrectas
# invalid_credentials = {
#     "username": "user",
#     "password": "wrong_password"
# }


# # Test: Test para un login exitoso con credenciales correctas.
# def test_login_success(client):
#     response = client.post("/api/v1/login", data=json.dumps(valid_credentials), content_type="application/json")

#     assert response.status_code == 200
#     assert "access_token" in response.json  # Debe devolver un token JWT


# # Test: Test para un login fallido con credenciales incorrectas.
# def test_login_failure(client):
#     response = client.post("/api/v1/login", data=json.dumps(invalid_credentials), content_type="application/json")

#     assert response.status_code == 401
#     assert "message" in response.json
#     assert response.json["message"] == "Invalid Credentials"



# ========================
# Pruebas de microphones
# ========================

# microphone_data = {
#     "model_microphone": "SM58",
#     "comment_microphone": "Micrófono dinámico"
# }

# updated_microphone_data = {
#     "model": "TM-2000",
#     "sensitivity": "-40 dB"
# }

# # Test: Test para insertar un nuevo micrófono en la base de datos.
# def test_insert_new_microphone(client):
#     response = client.post("/api/v1/microphones", data=json.dumps(microphone_data), content_type="application/json")
    
#     assert response.status_code == 200
#     assert "message" in response.json
#     assert response.json["message"] == "Registro creado correctamente"

# # Test: Test para obtener la lista de micrófonos.
# def test_query_microphones(client):
#     response = client.get("/api/v1/microphones")
    
#     assert response.status_code == 200
#     assert isinstance(response.json, list)  # Se espera una lista de micrófonos

# # Test: Test para actualizar un micrófono existente.
# def test_update_microphone(client):
#     microphone_id = 1  # Suponiendo que el micrófono con ID 1 existe
#     response = client.put(f"/api/v1/microphones/{microphone_id}", data=json.dumps(updated_microphone_data), content_type="application/json")
    
#     assert response.status_code == 200
#     assert response.json["message"] == "Registro actualizado correctamente"

# # Test: Test para eliminar un micrófono de la base de datos.
# def test_delete_microphone(client):
#     microphone_id = 7  # Suponiendo que el micrófono con ID 1 existe
#     response = client.delete(f"/api/v1/microphones/{microphone_id}")
    
#     assert response.status_code == 200
#     assert response.json["message"] == "Elemento eliminado correctamente"




# ========================
# Pruebas de processors
# ========================

# processor_data = {
#     "model_processor": "Intel Core i7",
#     "comment_processor": "High-performance processor"
# }

# updated_processor_data = {
#     "model_processor": "AMD Ryzen 9",
#     "comment_processor": "Updated processor details"
# }

# # Test: Test para insertar un nuevo procesador en la base de datos.
# def test_insert_new_processor(client):
#     response = client.post("/api/v1/processors", data=json.dumps(processor_data), content_type="application/json")
#     assert response.status_code == 200
#     assert "message" in response.json
#     assert response.json["message"] == "Registro creado correctamente"

# # Test: Test para obtener la lista de procesadores de la base de datos.
# def test_query_processors(client):
#     response = client.get("/api/v1/processors")
#     assert response.status_code == 200
#     assert isinstance(response.json, list)  # Se espera una lista de procesadores

# # Test: Test para actualizar un procesador existente en la base de datos.
# def test_update_processor(client):
#     processor_id = 1  # Suponiendo que el procesador con ID 1 existe
#     response = client.put(f"/api/v1/processors/{processor_id}", data=json.dumps(updated_processor_data), content_type="application/json")
#     assert response.status_code == 200
#     assert response.json["message"] == "Registro actualizado correctamente"

# # Test: Test para eliminar un procesador de la base de datos.
# def test_delete_processor(client):
#     processor_id = 1  # Suponiendo que el procesador con ID 1 existe
#     response = client.delete(f"/api/v1/processors/{processor_id}")
#     assert response.status_code == 200
#     assert response.json["message"] == "Elemento eliminado correctamente"



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
