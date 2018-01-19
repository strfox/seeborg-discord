import logging
import random
from src.stringutil import split_sentences, split_words


class SeeBorg4:
    def __init__(self, client, config, database):
        """
        :param client: ``discord.Client``
        :param config: ``SeeBorg4Config``
        :param database: ``SeeBorg4Database``
        """
        self._logger = logging.getLogger(SeeBorg4.__name__)
        self._client = client
        self._config = config
        self._database = database

    def _register_listeners(self):
        """
        Registers listeners to our client.
        """

        @self._client.event
        async def on_ready():
            await self.on_ready()

        @self._client.event
        async def on_message(message):
            await self.on_message(message)

    async def on_ready(self):
        """
        Event listener for ready event.
        """
        self._logger.info('Connected to Discord!')

    async def on_message(self, message):
        """
        Event listener for message event.

        :param message: ``discord.Message``
        """
        self._logger.info('MSG %s %s: %s' % (
            message.channel.id, message.author.id, message.content))

        if not self._should_process(message):
            return

        # Tokenize the message's content's
        words = split_words(message.clean_content)
        sentences = split_sentences(message.clean_content)

        for sentence in sentences:
            if self._should_learn(message):
                self._learn(words, sentences)

        if self._should_reply(message):
            self._reply(message.channel, words, sentences)

    def _should_process(self, message):
        """
        Returns true if we should process this message.

        :param message: ``discord.Message``
        :return: ``bool``
        """
        # Ignore own messages
        if self._is_own_message(message):
            return False

        # Ignore users in ignore list
        if self._config.is_ignored(message.author.id, message.channel.id):
            self._logger.debug('IGNORE %s' % message.author.id)
            return False

        return True

    def _should_learn(self, message):
        """
        Returns true if the bot meets all the conditions to learn the
        contents of the specified message.

        :param message: ``discord.Message``
        :return: ``bool``
        """
        if not self._config.learning(message.channel.id):
            return False

        # Ignore messages that match the blacklist
        if self._config.matches_blacklisted_pattern(message.channel.id,
                                                    message.clean_content):
            self._logger.debug('IS BLACKLISTED %s' % message)
            return False

        return True

    def _should_reply(self, message):
        """
        Returns true if the bot decides that it should reply to the specified
        message.

        :param message: ``discord.Message``
        :return: ``bool``
        """

        if not self._config.speaking(message.channel.id):
            return False

        # Generate a random number between 0 and 99 (inclusive)
        chance = random.randint(0, 99)

        # Check against reply mention
        reply_mention = self._config.reply_mention(message.channel.id)

        if reply_mention > 0 and self._client.user in message.mentions:
            if reply_mention == 100 or reply_mention > chance:
                self._logger.debug('REPLY REASON: MENTION')
                return True

        # Check against reply magic
        reply_magic = self._config.reply_magic(message.channel.id)

        if reply_magic > 0 and self._has_magic_word(message):
            if reply_magic == 100 or reply_magic > chance:
                self._logger.debug('REPLY REASON: MAGIC')
                return True

        # Check against reply rate
        reply_rate = self._config.reply_rate(message.channel.id)

        if reply_rate > 0 and (reply_rate == 100 or reply_rate > chance):
            self._logger.debug('REPLY REASON: RATE')
            return True
        else:
            self._logger.debug('NOT REPLYING')
            return False

    def start(self):
        self._logger.info('SeeBorg4 is starting')

        self._register_listeners()

        self._client.run(self._config.token())

    def _is_own_message(self, message):
        """
        Returns true if the specified message belongs to our `_client`.
        :param message: ``discord.Message``
        :return: ``bool``
        """
        return message.author.id == self._client.user.id

    def _has_magic_word(self, message):
        return self._config.matches_magic_pattern(message.channel.id,
                                                  message.clean_content)

    def _learn(self, words, sentences):
        """
        :param words: ``list[str]``
        :param sentences: ``list[str]``
        """
        self._logger.debug('In method: _learn')

    def _reply(self, channel, words, sentences):
        """
        Reply to the given input ``words`` and ``sentences`` and sends the
        answer to the given ``channel``.

        :param channel: ``discord.Channel``
        :param words: ``list[str]``
        :param sentences: ``list[str]``
        """
        self._logger.debug('In method: _reply')
