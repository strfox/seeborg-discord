import json


class Configuration:
    def __init__(self, **kwargs):
        self.token = kwargs['token']
        self.db_path = kwargs['db_path']
        self.behavior = Behavior(**kwargs['behavior'])
        self.channel_overrides = map(lambda x: ChannelOverride(**x), kwargs['channel_overrides'])

    @staticmethod
    def read_file(filename):
        """
        Reads a json file and builds a Configuration from it.

        :param filename: filename string
        :return: Configuration object
        """
        data = None
        with open(filename, 'r') as f:
            data = f.read()

        j = json.load(data)
        return Configuration(**j)


class Behavior:
    def __init__(self, **kwargs):
        self.reply_rate = kwargs['reply_rate']
        self.reply_mention = kwargs['reply_mention']
        self.reply_magic = kwargs['reply_magic']
        self.speaking = kwargs['speaking']
        self.learning = kwargs['learning']
        self.magic_words = kwargs['magic_words']
        self.blacklisted_words = kwargs['blacklisted_words']
        self.ignored_users = kwargs['ignored_users']


class ChannelOverride:
    def __init__(self, **kwargs):
        self.id = kwargs['id']
        self.behavior = Behavior(**kwargs['behavior'])