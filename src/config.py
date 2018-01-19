import yaml
import logging


class SeeBorg4Config:

    def __init__(self, dict_):
        """
        :param dict_: ``dict``
        """
        self._logger = logging.getLogger(SeeBorg4Config.__name__)
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
        """
        :return: ``str``
        """
        return self._dict['token']

    def database_path(self):
        """
        :return: ``str``
        """
        return self._dict['databasePath']

    def is_ignored(self, author_id, channel_id):
        """
        :param author_id: ``str``
        :param channel_id: ``str``
        :return: ``bool``
        """
        return author_id in self.behavior(channel_id, 'ignoredUsers')

    def behavior(self, channel_id, property_name):
        """
        Returns the property for the given channel if it's overridden; otherwise, it returns the
        property from the default, root behavior.

        :param channel_id: ``str``
        :param property_name: ``str``
        :return: ``any``
        """
        default_behavior_value = self._dict['behavior'][property_name]
        override = self._override_for_channel(channel_id)

        if override is None or property_name not in override['behavior']:
            return default_behavior_value
        else:
            self._logger.debug('OVERRIDDEN BEHAVIOR %s IN %s' % (property_name, channel_id))
            return override['behavior'][property_name]

    def _override_for_channel(self, channel_id):
        for override in self._dict['channelOverrides']:
            if override['channelId'] == channel_id:
                return override
        return None
