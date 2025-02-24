# /controllers/__init__.py

from .diagnostics_controller import insert_new_diagnostic, query_diagnostics, update_diagnostic, delete_diagnostic
from .download_recordings_controller import download_recording, download_all_recordings, spectrogram
from .insert_files_controller import insert_files
from .locations_controller import insert_new_location, query_locations, update_location, delete_location
from .log_recorders_controller import insert_status
from .login_controller import login
from .microphones_controller import insert_new_microphone, query_microphones, update_microphone, delete_microphone
from .processors_controller import insert_new_processor, query_processors, update_processor, delete_processor
from .recorders_controller import insert_new_recorder, query_recorders, update_recorder, delete_recorder
from .recordings_controller import insert_new_recording, query_recordings, update_recording, delete_recording
from .sing_events_controller import insert_new_sing_event, query_sing_events, update_sing_event, delete_sing_event
from .species_controller import insert_new_specie, query_species, update_specie, delete_specie
from .upload_singevent_controller import upload_folder
