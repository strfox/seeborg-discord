import logging
import random
import importlib
import asyncio

from .stringutil import split_words


class SeeBorg4:
    def __init__(self, client, config, database_module):
        self.__logger = logging.getLogger(SeeBorg4.__name__)
        self.__client = client
        self.__config = config
        self.__database = importlib.import_module(database_module)

    def start(self):
        self.__logger.info('SeeBorg4 is starting')
        self.__register_listeners()
        self.__client.run(self.__config.token())

    async def on_ready(self):
        self.__logger.info('Connected to Discord!')

    async def on_message(self, message):
        """
        Event listener for on_message event.

        When a message is received, log it to the console and then decide if
        the message should be processed by the learn/speak logic.
        """
        self.__logger.info('MSG %s %s: %s' % (
            message.channel.id, message.author.id, message.content))

        if not self.__should_process(message):
            return

        if self.__should_learn(message):
            self.__learn(message.clean_content)

        if self.__should_compute_answer(message):
            await self.__reply_with_answer(message.channel, message.clean_content)

    def __should_process(self, message):
        # Ignore own messages
        if self.__is_own_message(message):
            return False

        # Ignore users in ignore list
        if self.__config.is_ignored(message.author.id, message.channel.id):
            self.__logger.debug('IGNORE %s' % message.author.id)
            return False

        return True

    def __register_listeners(self):
        @self.__client.event
        async def on_ready():
            await self.on_ready()

        @self.__client.event
        async def on_message(message):
            await self.on_message(message)

    def __should_learn(self, message):
        if not self.__config.learning(message.channel.id):
            return False

        # Ignore messages that match the blacklist
        if self.__config.matches_blacklisted_pattern(message.channel.id,
                                                     message.clean_content):
            self.__logger.debug('IS BLACKLISTED %s' % message)
            return False

        return True

    def __should_compute_answer(self, message):
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
        # Bot should not speak if speaking is set to false
        if not self.__config.speaking(message.channel.id):
            return False

        # Bot should not speak if they don't have permission
        permissions = message.server.me.permissions_in(message.channel)
        if not permissions.send_messages:
            return False

        # Check against chances
        reply_mention = self.__config.reply_mention(message.channel.id)
        reply_magic = self.__config.reply_magic(message.channel.id)
        reply_rate = self.__config.reply_rate(message.channel.id)

        def reply_mention_condition():
            return self.__client.user in message.mentions

        def reply_magic_condition():
            return self.__config.matches_magic_pattern(message.channel.id, message.clean_content)

        def reply_rate_condition():
            return True

        def chance_predicate(chance_percentage, predicate):
            randint = random.randint(0, 99)  # Generate a number between 0 and 99 (inclusive)
            if chance_percentage > 0 and predicate():
                if chance_percentage > randint or chance_percentage == 100:
                    return True
            return False

        if chance_predicate(reply_mention, reply_mention_condition):
            self.__logger.debug('REPLY MENTION')
            return True
        elif chance_predicate(reply_magic, reply_magic_condition):
            self.__logger.debug('REPLY MAGIC')
            return True
        elif chance_predicate(reply_rate, reply_rate_condition):
            self.__logger.debug('REPLY RATE')
            return True
        else:
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
        :param line ``str``
        """
        self.__logger.debug('In method: __learn')
        try:
            self.__database.insert_line(line)
        except Exception as e:
            self.__logger.debug(str(e))

    async def __reply_with_answer(self, channel, line):
        """
        Builds an answer to the given line and sends the answer to the given
        channel.

        :param channel: ``discord.Channel``
        :param line ``str``
        """
        self.__logger.debug('In method: __reply')

        await self.__client.send_typing(channel)
        response = self.__compute_answer(line)
        await self.__client.send_message(channel, response)

    def __compute_answer(self, line):
        """
        Builds a response to the specified line, using the SeeBorg algorithm.

        :param line: ``str``
        :return: ``str | None``
        """
        words = split_words(line)
        known_words = list(filter(lambda w: self.__database.is_word_known(w), words))
        pivot = random.choice(known_words)
        sentences = self.__database.sentences_with_word(pivot, 2)

        if not sentences:
            return None
        elif len(sentences) == 1:
            return sentences[0]

        left_sentence = sentences[0]
        right_sentence = sentences[1]
        left_sentence_words = split_words(left_sentence)
        right_sentence_words = split_words(right_sentence)
        left_side = left_sentence_words[:left_sentence_words.index(pivot)]
        right_side = right_sentence_words[right_sentence_words.index(pivot) + 1:]

        return ' '.join([str(x) for x in (left_side + [pivot] + right_side)])
