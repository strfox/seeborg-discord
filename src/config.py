import yaml


class SeeBorg4Config:

    def __init__(self, dict_):
        """
        :param dict_: ``dict``
        """
        self._dict = dict_

    @staticmethod
    def load_config(filename):
        """
        :param filename: ``str``
        :return: ``SeeBorg4Config``
        """
        with open(filename, 'r') as f:
            return SeeBorg4Config(yaml.load(f.read()))

    def token(self):
        return self._dict['token']

    def database_path(self):
        return self._dict['databasePath']
