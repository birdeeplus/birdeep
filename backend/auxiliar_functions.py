
def translate_keys_json(json_dict, translation_dict, keys_list):
    """ This function encodes the json_request dictionary to relate request features with database features"""
    for i, item in enumerate(keys_list):
        if item in translation_dict.keys():
            json_dict[translation_dict[item]] = json_dict.pop(item)
            keys_list[i] = translation_dict[item]

    return json_dict, keys_list

