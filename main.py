import argparse
import logging.config
import discord
from src import database

from src.config import SeeBorg4Config
from src.seeborg import SeeBorg4

# Configure the logger
logging.config.fileConfig('logging.conf')
logger = logging.getLogger(__name__)


def main():
    # Parse command-line arguments
    arg_parse = argparse.ArgumentParser(description='SeeBorg4')
    arg_parse.add_argument('-c', '--config', help='YAML config file',
                           required=True)
    args = arg_parse.parse_args()

    # Load configuration
    config = SeeBorg4Config.load_config(args.config)

    # Load database
    database.init_db(config.database_path())

    # Instantiate client
    client = discord.Client()

    # Instantiate bot and start it
    bot = SeeBorg4(client, config, 'src.database')
    bot.start()


if __name__ == '__main__':
    main()
