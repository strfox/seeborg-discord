import yaml
import logging
import re


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
        return author_id in self._behavior(channel_id, 'ignoredUsers')

    def matches_blacklisted_pattern(self, channel_id, line):
        """
        Returns true if the specified line matches a blacklisted pattern

        :param channel_id: ``str``
        :param line: ``str``
        :return: ``bool``
        """
        patterns = self._behavior(channel_id, 'blacklistedPatterns')

        for pattern in patterns:
            regex = re.compile(pattern, re.M + re.I)
            if regex.match(line) is not None:
                self._logger.debug('BLACKLISTED PATTERN [%s] MATCHED [%s]' % (pattern, line))
                return True

        return False

    def matches_magic_pattern(self, channel_id, line):
        """
        Returns true if the specified line matches a magic pattern

        :param channel_id: ``str``
        :param line: ``str``
        :return: ``bool``
        """
        patterns = self._behavior(channel_id, 'magicPattern')

        for pattern in patterns:
            regex = re.compile(pattern, re.M + re.I)
            if regex.match(line) is not None:
                self._logger.debug('MAGIC PATTERN [%s] MATCHED [%s]' % (pattern, line))
                return True

        return False

    def reply_rate(self, channel_id):
        """
        Returns the reply rate percentage for the channel with the specified id.

        :param channel_id: ``str``
        :return: ``any``
        """
        return self._behavior(channel_id, 'replyRate')

    def reply_mention(self, channel_id):
        """
        Returns the reply mention percentage for the channel with the specified id.

        :param channel_id: ``str``
        :return: ``any``
        """
        return self._behavior(channel_id, 'replyMention')

    def reply_magic(self, channel_id):
        """
        Returns the reply magic percentage for the channel with the specified id.

        :param channel_id: ``str``
        :return: ``any``
        """
        return self._behavior(channel_id, 'replyMagic')

    def speaking(self, channel_id):
        """
        Returns the speaking property for the channel with the given id.

        :param channel_id: ``str``
        :return: ``any``
        """
        return self._behavior(channel_id, 'speaking')

    def learning(self, channel_id):
        """
        Returns the learning property for the channel with the given id.

        :param channel_id: ``str``
        :return: ``any``
        """
        return self._behavior(channel_id, 'learning')

    def _behavior(self, channel_id, property_name):
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
        """
        Returns the override object for the channel with the given id.

        :param channel_id: ``str``
        :return: ``any|None``
        """
        for override in self._dict['channelOverrides']:
            if override['channelId'] == channel_id:
                return override
        return None
