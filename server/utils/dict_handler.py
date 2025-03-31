def destructure_dict(dict_list):
    """
    Destructure a list of dictionaries to extract all key-value pairs.

    :param dict_list: List of dictionaries to destructure.
    :return: A single dictionary containing all key-value pairs.
    """
    result = {}
    for dict in dict_list:
        for (
            key,
            value,
        ) in dict.items():
            result[key] = value

    return result


def update_dict_key(data):
    for index, ld in enumerate(data):
        keys_to_update = list(ld.keys())  # Create a list of keys to avoid runtime error
        for key in keys_to_update:
            ld[f"{key}_{index + 1}"] = ld.pop(key)  # Update the key with the new format
