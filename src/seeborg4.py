import logging
import random


class SeeBorg4:
    def __init__(self, client, config, database):
        """
        :param client: ``discord.Client``
        :param config:
        :param database:
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
        Event listener for on_ready event.
        Logs to the console informing the user that the client is connected.
        """
        self.__logger.info('Connected to Discord!')

    async def on_message(self, message):
        """
        Event listener for on_message event.

        When a message is received, log it to the console and then decide if
        the message should be processed by the learn/speak logic.

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
        Check if the given message should be processed by SeeBorg4.

        A message should be processed if all conditions are met:
            - The message doesn't belong to our own client
            - The author of the message isn't in the ignore list

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
        Check if the given message should be learned by SeeBorg4.

        A message will be learned if all following conditions are met:
            - Learning is enabled in the configuration
            - The contents of the message don't match any blacklisted patterns

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
        Check if the given message should be replied to by SeeBorg4.

        A message is eligible for a response if all following conditions are
        met:
            - Speaking is enabled in our configuration
            - Any of the following conditions are met:

                - The message mentions our user and our random number conforms
                  to our chance of replying to a mention
                - The message's content matches a magic word pattern and our
                  random number conforms to our chance of replying to a magic
                  sentence
                - Our random number conforms to our chance of replying to a
                  regular sentence

        :param message: ``discord.Message``
        :return: ``bool``
        """
        if not self.__config.speaking(message.channel.id):
            return False

        def chance_predicate(chance_percentage, predicate):
            randint = random.randint(0, 99)  # Generate a number between 0 and 99 (inclusive)
            if chance_percentage > 0 and predicate():
                if chance_percentage > randint or chance_percentage == 100:
                    return True
            return False

        reply_mention = self.__config.reply_mention(message.channel.id)

        if chance_predicate(reply_mention, lambda: self.__client.user in message.mentions):
            self.__logger.debug('REPLY MENTION')
            return True

        reply_magic = self.__config.reply_magic(message.channel.id)

        def has_magic_pattern():
            return self.__config.matches_magic_pattern(message.channel.id, message.clean_content)

        if chance_predicate(reply_magic, lambda: has_magic_pattern()):
            self.__logger.debug('REPLY MAGIC')
            return True

        reply_rate = self.__config.reply_rate(message.channel.id)

        if chance_predicate(reply_rate, lambda: True):
            self.__logger.debug('REPLY RATE')
            return True

        self.__logger.debug('REPLY FAIL')
        return False

    def __is_own_message(self, message):
        """
        Returns true if the specified message belongs to our `_client`.

        :param message: ``discord.Message``
        :return: ``bool``
        """
        return message.author.id == self.__client.user.id

    def __learn(self, line):
        """
        #TODO

        :param line ``str``
        """
        self.__logger.debug('In method: __learn')

    def __reply(self, channel, line):
        """
        #TODO
        Builds an answer to the given line and sends the answer to the given
        channel.

        :param channel: ``discord.Channel``
        :param line ``str``
        """
        self.__logger.debug('In method: __reply')
