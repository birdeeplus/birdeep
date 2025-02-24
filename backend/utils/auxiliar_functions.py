# /utils/auxiliar_functions.py
# El objetivo de la función es modificar el json_dict y la keys_list para que las claves del diccionario JSON se reemplacen por las correspondientes claves de base de datos, según lo dictado por translation_dict.

def translate_keys_json(json_dict, translation_dict, keys_list):
    """ This function encodes the json_request dictionary to relate request features with database features"""
    for i, item in enumerate(keys_list):
        if item in translation_dict.keys():
            json_dict[translation_dict[item]] = json_dict.pop(item)
            keys_list[i] = translation_dict[item]

    return json_dict, keys_list

# Ejemplo:

# Si las variables son:
#     json_dict = {"name": "Alice", "age": 30}
#     translation_dict = {"name": "full_name", "age": "years_old"}
#     keys_list = ["name", "age"]

# Ahora el cambio:
#     json_dict = {"full_name": "Alice", "years_old": 30}
#     keys_list = ["full_name", "years_old"]
