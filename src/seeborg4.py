import logging


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
            self._logger.info('Connected to Discord!')

        @self._client.event
        async def on_message(message):
            """
            :param message: ``discord.Message``
            """
            self._logger.info('MSG %s %s: %s' % (message.channel.id, message.author.id, message.content))

            # Ignore own messages
            if self._is_own_message(message):
                return

            if self._config.is_ignored(message.author.id, message.channel.id):
                self._logger.debug('IGNORE %s' % message.author.id)
                return

            self._logger.info('Woohoo!')

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