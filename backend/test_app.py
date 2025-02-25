# test_app.py

import pytest
import json
from app import app
import os

@pytest.fixture
def client():
    app.config['TESTING'] = True
    client = app.test_client()
    yield client


# ========================
# Pruebas de diagnostics
# ========================

# diagnostic_data = {
#     "id_record": 2,
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

# # Test: Descargar un archivo de audio existente
# def test_download_recording(client):

#     file_path = "datos_audios_bd/audio_data/2/test-audio.wav"  # Ruta del archivo en el backend

#     response = client.get(
#         "/api/v1/download_recording",
#         data=file_path.encode("utf-8"),  # Enviamos la ruta en el cuerpo de la petición
#         content_type="text/plain"
#     )

#     # Verifica que la solicitud fue exitosa (Código 200 OK)
#     assert response.status_code == 200, f"Error: {response.data.decode()}"

#     # Verifica que la respuesta contiene un archivo WAV
#     assert response.content_type == "audio/wav"

#     # Guarda el archivo descargado en una ubicación temporal
#     downloaded_file = "test_downloaded.wav"
#     with open(downloaded_file, "wb") as f:
#         f.write(response.data)

#     # Verifica que el archivo se ha guardado en local
#     assert os.path.exists(downloaded_file)

#     # Elimina el archivo después de la prueba
#     # os.remove(downloaded_file)


# ========================
# Pruebas de insert_files
# ========================

# def test_upload_file(client):
#     data = {
#         "json_data": json.dumps({
#             "file1": { "id_recorder_record": "2" }
#         })
#     }

#     file_path = "test-audio.wav"
#     with open(file_path, "wb") as f:
#         f.write(b"Contenido de prueba")  # Crear archivo de prueba

#     with open(file_path, "rb") as f:
#         response = client.post(
#             "/api/v1/insert_files",
#             data={**data, "file1": f},
#             content_type="multipart/form-data"
#         )

#     assert response.status_code == 200
#     assert response.json["message"] == "Archivos almacenados correctamente"



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

# recorder_data = {
#     "model_recorder": "Zoom H6",
#     "comment_recorder": "Portable audio recorder"
# }

# updated_recorder_data = {
#     "model_recorder": "Tascam DR-40X",
#     "comment_recorder": "Updated recorder details"
# }

# # Test: Test para insertar un nuevo recorder en la base de datos.
# def test_insert_new_recorder(client):
#     response = client.post("/api/v1/recorders", data=json.dumps(recorder_data), content_type="application/json")
#     assert response.status_code == 200
#     assert "message" in response.json
#     assert response.json["message"] == "Registro creado correctamente"

# # Test: Test para obtener la lista de recorders de la base de datos.
# def test_query_recorders(client):
#     response = client.get("/api/v1/recorders")
#     assert response.status_code == 200
#     assert isinstance(response.json, list)  # Se espera una lista de recorders

# # Test: Test para actualizar un recorder existente en la base de datos.
# def test_update_recorder(client):
#     recorder_id = 1  # Suponiendo que el recorder con ID 1 existe
#     response = client.put(f"/api/v1/recorders/{recorder_id}", data=json.dumps(updated_recorder_data), content_type="application/json")
#     assert response.status_code == 200
#     assert response.json["message"] == "Registro actualizado correctamente"

# # Test: Test para eliminar un recorder de la base de datos.
# def test_delete_recorder(client):
#     recorder_id = 1  # Suponiendo que el recorder con ID 1 existe
#     response = client.delete(f"/api/v1/recorders/{recorder_id}")
#     assert response.status_code == 200
#     assert response.json["message"] == "Elemento eliminado correctamente"


# ========================
# Pruebas de recordings
# ========================

# recording_data = {
#     "filename": "test_recording.wav",
#     "duration": 120,
#     "timestamp": "2025-02-24T10:30:00",
#     "id_recorder_recordings": 5  # Suponiendo que el recorder con ID 5 existe
# }

# updated_recording_data = {
#     "filename": "updated_recording.wav",
#     "duration": 150,
#     "timestamp": "2025-02-24T11:00:00",
#     "id_recorder_recordings": 5   # Suponiendo que el recorder con ID 5 existe
# }

# recording_data_invalid = {
#     "filename": "invalid_recording.wav",
#     "duration": 100,
#     "timestamp": "2025-02-24T12:00:00",
#     "id_recorder_recordings": 9999  # ID inexistente
# }

# update_data_invalid_recorder = {
#     "filename": "invalid_recorder.wav",
#     "duration": 200,
#     "timestamp": "2025-02-24T12:00:00",
#     "id_recorder_recordings": 9999  # Recorder inexistente
# }

# update_data_not_found = {
#     "filename": "non_existent.wav",
#     "duration": 180,
#     "timestamp": "2025-02-24T11:45:00",
#     "id_recorder_recordings": 4 # ID válido pero la grabación no existe
# }


# # Test: Insertar una grabación con un recorder existente
# def test_insert_new_recording(client):
#     response = client.post("/api/v1/recordings", data=json.dumps(recording_data), content_type="application/json")
#     assert response.status_code == 200
#     assert "message" in response.json
#     assert response.json["message"] == "Registro creado correctamente"

# # Test: Intentar insertar una grabación con un recorder que NO existe
# def test_insert_new_recording_invalid(client):
#     response = client.post("/api/v1/recordings", data=json.dumps(recording_data_invalid), content_type="application/json")
#     assert response.status_code == 400  # Debe fallar con error 400
#     assert "error" in response.json
#     assert response.json["error"] == "Recorder no encontrado"

# # Test: Obtener la lista de grabaciones de la base de datos
# def test_query_recordings(client):
#     response = client.get("/api/v1/recordings")
#     assert response.status_code == 200
#     assert isinstance(response.json, list)  # Se espera una lista de grabaciones

# # Test: Actualizar una grabación existente con un recorder válido
# def test_update_recording(client):
#     recording_id = 20  # Suponiendo que la grabación con ID 16 existe
#     response = client.put(f"/api/v1/recordings/{recording_id}", data=json.dumps(updated_recording_data), content_type="application/json")
#     assert response.status_code == 200
#     assert response.json["message"] == "Registro actualizado correctamente"

# # Test: Intentar actualizar una grabación que NO existe
# def test_update_recording_not_found(client):
#     response = client.put("/api/v1/recordings/1", data=json.dumps(update_data_not_found), content_type="application/json")  # ID inexistente
#     assert response.status_code == 404
#     assert "error" in response.json
#     assert response.json["error"] == "Recording no encontrado"

# # Test: Intentar actualizar una grabación con un recorder que NO existe
# def test_update_recording_invalid_recorder(client):
#     response = client.put("/api/v1/recordings/10", data=json.dumps(update_data_invalid_recorder), content_type="application/json")
#     assert response.status_code == 400
#     assert "error" in response.json
#     assert response.json["error"] == "Recorder no encontrado"

# # Test: Eliminar una grabación de la base de datos
# def test_delete_recording(client):
#     recording_id = 16  # Suponiendo que la grabación con ID 16 existe
#     response = client.delete(f"/api/v1/recordings/{recording_id}")
#     assert response.status_code == 200
#     assert response.json["message"] == "Elemento eliminado correctamente"



# ========================
# Pruebas de sing_events
# ========================

# sing_event_data = {
#     "id_diagnostic_event": 3, 
#     "time_event": "2025-02-24T10:30:00",
#     "start_event": 0.12345678,
#     "end_event": 0.98765432,
#     "overlap_event": True,
#     "confidence_event": 0.95,
#     "sensitivity_event": 0.80,
#     "quality_score_manual_event": 0.75
# }

# updated_sing_event_data = {
#     "id_diagnostic_event": 3,
#     "time_event": "2025-02-24T12:00:00",
#     "start_event": 0.23456789,
#     "end_event": 0.87654321,
#     "overlap_event": False,
#     "confidence_event": 0.90,
#     "sensitivity_event": 0.85,
#     "quality_score_manual_event": 0.80
# }

# # Test: Insertar un evento de canto válido
# def test_insert_new_sing_event(client):
#     response = client.post("/api/v1/sing_events", data=json.dumps(sing_event_data), content_type="application/json")
#     assert response.status_code == 200
#     assert "message" in response.json
#     assert response.json["message"] == "Registro creado correctamente"

# # Test: Obtener la lista de eventos de canto
# def test_query_sing_events(client):
#     response = client.get("/api/v1/sing_events")
#     assert response.status_code == 200
#     assert isinstance(response.json, list)  # Se espera una lista de eventos de canto

# # Test: Actualizar un evento de canto existente
# def test_update_sing_event(client):
#     sing_event_id = 2  # Suponiendo que el evento con ID 1 existe
#     response = client.put(f"/api/v1/sing_events/{sing_event_id}", data=json.dumps(updated_sing_event_data), content_type="application/json")
#     assert response.status_code == 200
#     assert response.json["message"] == "Registro actualizado correctamente"

# # Test: Eliminar un evento de canto
# def test_delete_sing_event(client):
#     sing_event_id = 2  # Suponiendo que el evento con ID 1 existe
#     response = client.delete(f"/api/v1/sing_events/{sing_event_id}")
#     assert response.status_code == 200
#     assert response.json["message"] == "Elemento eliminado correctamente"



# ========================
# Pruebas de species
# ========================

# # Datos de prueba para una especie válida
# specie_data = {
#     "scientific_name": "Turdus merula",
#     "common_name": "Mirlo común",
#     "family": "Turdidae",
#     "order": "Passeriformes",
#     "conservation_status": "LC"
# }

# # Datos de prueba para una especie actualizada
# updated_specie_data = {
#     "scientific_name": "Turdus merula",
#     "common_name": "Mirlo negro",
#     "family": "Turdidae",
#     "order": "Passeriformes",
#     "conservation_status": "LC"
# }

# # Datos de prueba para una especie inexistente
# invalid_specie_data = {
#     "scientific_name": "Inexistente",
#     "common_name": "Especie no existente",
#     "family": "Desconocida",
#     "order": "Desconocido",
#     "conservation_status": "NE"
# }

# # Test: Insertar una nueva especie en la base de datos
# def test_insert_new_specie(client):
#     response = client.post("/api/v1/species", data=json.dumps(specie_data), content_type="application/json")
#     assert response.status_code == 200
#     assert "message" in response.json
#     assert response.json["message"] == "Registro creado correctamente"

# # Test: Obtener la lista de especies de la base de datos
# def test_query_species(client):
#     response = client.get("/api/v1/species")
#     assert response.status_code == 200
#     assert isinstance(response.json, list)  # Se espera una lista de especies



# ========================
# Pruebas de upload_singevent
# ========================






