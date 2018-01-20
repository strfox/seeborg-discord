import logging
import random


class SeeBorg4:
    def __init__(self, client, config):
        """
        :param client: ``discord.Client``
        :param config: ``SeeBorg4Config``
        """
        self.__logger = logging.getLogger(SeeBorg4.__name__)
        self.__client = client
        self.__config = config

    def start(self):
        self.__logger.info('SeeBorg4 is starting')
        self.__register_listeners()
        self.__client.run(self.__config.token())

    async def on_ready(self):
        """
        Event listener for ready event.
        """
        self.__logger.info('Connected to Discord!')

    async def on_message(self, message):
        """
        Event listener for message event.

        :param message: ``discord.Message``
        """
        self.__logger.info('MSG %s %s: %s' % (
            message.channel.id, message.author.id, message.content))

        if not self.__should_process(message):
            return

        if self.__should_learn(message):
            self.__learn(message.clean_content)

        if self.__should_reply(message):
            self.__reply(message.channel, message.clean_content)

    def __should_process(self, message):
        """
        Returns true if we should process this message.

        :param message: ``discord.Message``
        :return: ``bool``
        """
        # Ignore own messages
        if self.__is_own_message(message):
            return False

        # Ignore users in ignore list
        if self.__config.is_ignored(message.author.id, message.channel.id):
            self.__logger.debug('IGNORE %s' % message.author.id)
            return False

        return True

    def __register_listeners(self):
        """
        Registers listeners to our client.
        """

        @self.__client.event
        async def on_ready():
            await self.on_ready()

        @self.__client.event
        async def on_message(message):
            await self.on_message(message)

    def __should_learn(self, message):
        """
        Returns true if the bot meets all the conditions to learn the
        contents of the specified message.

        :param message: ``discord.Message``
        :return: ``bool``
        """
        if not self.__config.learning(message.channel.id):
            return False

        # Ignore messages that match the blacklist
        if self.__config.matches_blacklisted_pattern(message.channel.id,
                                                     message.clean_content):
            self.__logger.debug('IS BLACKLISTED %s' % message)
            return False

        return True

    def __should_reply(self, message):
        """
        Returns true if the bot decides that it should reply to the specified
        message.

        :param message: ``discord.Message``
        :return: ``bool``
        """

        if not self.__config.speaking(message.channel.id):
            return False

        # Generate a random number between 0 and 99 (inclusive)
        chance = random.randint(0, 99)

        # Check against reply mention
        reply_mention = self.__config.reply_mention(message.channel.id)
        if reply_mention > 0:
            if self.__client.user in message.mentions:
                if reply_mention == 100 or reply_mention > chance:
                    self.__logger.debug('REPLY REASON: MENTION')
                    return True

        # Check against reply magic
        reply_magic = self.__config.reply_magic(message.channel.id)
        if reply_magic > 0:
            if self.__has_magic_word(message):
                if reply_magic == 100 or reply_magic > chance:
                    self.__logger.debug('REPLY REASON: MAGIC')
                    return True

        # Check against reply rate
        reply_rate = self.__config.reply_rate(message.channel.id)
        if reply_rate > 0:
            if reply_rate == 100 or reply_rate > chance:
                self.__logger.debug('REPLY REASON: RATE')
                return True

        # All checks failed
        self.__logger.debug('NOT REPLYING')
        return False

    def __is_own_message(self, message):
        """
        Returns true if the specified message belongs to our `_client`.
        :param message: ``discord.Message``
        :return: ``bool``
        """
        return message.author.id == self.__client.user.id

    def __has_magic_word(self, message):
        return self.__config.matches_magic_pattern(message.channel.id,
                                                   message.clean_content)

    def __learn(self, line):
        """
        Learn a line.

        :param line ``str``
        """
        self.__logger.debug('In method: __learn')

    def __reply(self, channel, line):
        """
        Reply to the given line and sends the answer to the given channel.

        :param channel: ``discord.Channel``
        :param line ``str``
        """
        self.__logger.debug('In method: __reply')
