import yaml


class SeeBorg4Config:
    def __init__(self):
        pass

    @staticmethod
    def load_config(filename):
        with open(filename, 'r') as f:
            return yaml.load(f.read())