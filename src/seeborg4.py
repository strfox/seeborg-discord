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
            self._logger.info('MSG %s: %s' % (message.channel.id, message.content))

    def start(self):
        self._logger.info('SeeBorg4 is starting')
        self._register_listeners()
        self._client.run(self._config.token())
