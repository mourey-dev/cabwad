import configparser
import os
from pathlib import Path


def get_config(section=None, key=None):
    """
    Read configuration from configurations.cnf file.

    Args:
        section: The configuration section
        key: The specific key to retrieve

    Returns:
        The requested configuration value, the entire section as dict,
        or the complete config object if no section specified
    """
    config = configparser.ConfigParser()
    config_file = os.path.join(Path(__file__).parent.parent, "configurations.cnf")

    if not os.path.exists(config_file):
        raise FileNotFoundError(f"Configuration file not found: {config_file}")

    config.read(config_file)

    if section is None:
        return config

    if section not in config:
        return None

    if key is None:
        return dict(config[section])

    return config[section].get(key)
