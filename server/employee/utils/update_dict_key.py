def update_dict_key(data):
    for index, ld in enumerate(data):
        keys_to_update = list(ld.keys())  # Create a list of keys to avoid runtime error
        for key in keys_to_update:
            ld[f"{key}_{index + 1}"] = ld.pop(key)  # Update the key with the new format
