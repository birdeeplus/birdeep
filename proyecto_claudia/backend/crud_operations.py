# crud_operations.py

import os
from models import db
from flask import jsonify
from auxiliar_functions import *
from dateutil import parser
import pandas as pd
from io import StringIO
from datetime import datetime

def get_values_from_db(request, db_object):

    features_dict = {}

    for key, value in request.args.items():
        features_dict[key] = value

    query = db_object.query

    for key, value in features_dict.items():
        if value is not None:
            query = query.filter(getattr(db_object, key).like(f"%{value}"))

    filtered_query = query.all()

    result = []

    for item in filtered_query:
        result_dict = {}
        for column in item.__table__.columns.keys():
            if item in ['status', 'installation_date', 'time_record', 'time_executed','time_event']:
                result_dict[column] = getattr(parser.parse(item), column)
            else:
                result_dict[column] = getattr(item, column)
        result.append(result_dict)

    return result


def insert_values_in_db(request, db_object, translate_dict=None, json_loaded=False):
    if json_loaded:
        request_json = request
    else:
        request_json = request.get_json()

    keys_request = list(request_json.keys())


    if translate_dict is not None:
        request_json, keys_request = translate_keys_json(request_json, translate_dict, keys_request)

    new_record = db_object()

    for i, key in enumerate(keys_request):
        setattr(new_record, key, request_json[key])

    db.session.add(new_record)
    db.session.commit()

    return {'message': 'Registro creado correctamente'}

def insert_in_singevent(request, db_object_sing,db_object_diagnostic,db_object_recording, json_loaded=False):
    if json_loaded:
        request_json = request
    else:
        request_json = request.get_json()

    keys_request = list(request_json.keys())
    for key in keys_request:  # Entra dentro de cada .txt
        new_diagnostic = db_object_diagnostic()

        sep = key.split('_')
        sep1 = sep[2].split('.')
        hora = f"{sep1[0][:2]}:{sep1[0][2:4]}:{sep1[0][4:]}"
        fecha = datetime.strptime(sep[1], "%Y%m%d")
        fecha_formateada = fecha.strftime("%Y/%m/%d")
        fecha_final = fecha_formateada + ' ' + hora  # Formato final de la fecha

        sep2 = key.split('.')
        name_recording = sep2[0]
        query = db_object_recording.query
        query = query.filter(getattr(db_object_recording, 'uri').like(f"%%{name_recording}%")).first()
        id_recording = query.id_record
        # Cargo el diagnostico con los datos
        setattr(new_diagnostic, 'time_executed', fecha_final)
        setattr(new_diagnostic, 'used_model', sep[0])
        setattr(new_diagnostic, 'model_version', 'Experto')
        setattr(new_diagnostic, 'pretreatment', 'tratamiento')
        setattr(new_diagnostic, 'created_by', 'yo')
        setattr(new_diagnostic, 'id_record_diagnostic', id_recording)
        db.session.add(new_diagnostic)
        db.session.commit()
        column_names = ["Selection", "View", "Channel", "Begin Time (s)", "End Time (s)", "Low Freq (Hz)",
                        "High Freq (Hz)", "species"]
        df = pd.read_csv(StringIO(request_json[key]), sep='\t',header=0, names=column_names)
        for row in df.itertuples(): # Cada fila de cada .txt
            new_record = db_object_sing()
            # Cargo los sing events con los datos
            id_diagnostic = new_diagnostic.id_diagnostic
            setattr(new_record, 'id_diagnostic_event', id_diagnostic)
            setattr(new_record, 'time_event', fecha_final)
            setattr(new_record, 'start_event', row[4])
            setattr(new_record, 'end_event', row[5])
            setattr(new_record, 'overlap_event', 0)
            setattr(new_record, 'confidence_event', 0)
            setattr(new_record, 'sensitivity_event', 0)
            setattr(new_record, 'quality_score_manual_event', 0)
            setattr(new_record, 'comment', ' ')
            setattr(new_record, 'scientific_name_specie',row[8])
            db.session.add(new_record)
            db.session.commit()

    return {'message': 'Registro creado correctamente'}


def update_values_in_db(request, element_id, db_object, translate_dict=None):

    record = db_object.query.get(element_id)

    if not record:
        return jsonify({'message': 'record not found in database'}), 404

    request_json = request.get_json()
    keys_request = list(request_json.keys())

    if translate_dict is not None:
        request_json, keys_request = translate_keys_json(request_json, translate_dict, keys_request)

    for key in keys_request:
        if key in ['status','installation_date','time_record','time_executed','time_event']:
            setattr(record, key, parser.parse(request_json[key]))
        else:
            setattr(record, key, request_json[key])

    db.session.commit()

    return {'message': 'Registro actualizado correctamente'}


def delete_values_in_db(element_id, db_object):

    record = db_object.query.get(element_id)

    if not record:
        return jsonify({'message': 'record not found in database'}), 404

    db.session.delete(record)
    db.session.commit()

    return {'message': 'Elemento eliminado correctamente'}


def save_files_in_storage(json_data, files, db_object):
    for key in json_data.keys():
        file = files[key]
        file_info = json_data[str(key)]
        # path = '/datos2/audio_data/{}'.format(str(file_info['id_recorder_record']))
        path = '/home/miguel-ebd/prueba_almacenamiento/{}'.format(str(file_info['id_recorder_record']))
        if not os.path.exists(path):
            os.makedirs(path)
        uri = path + '/' + str(file_info['id_recorder_record'])
        file.save(uri)
        file_info.update({'uri': uri, 'device': 'ebd-server'})
        insert_values_in_db(file_info, db_object, json_loaded=True)

    return {'message': 'Archivos almacenados correctamente'}
