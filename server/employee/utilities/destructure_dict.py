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
