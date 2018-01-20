import argparse
import logging.config
import discord

from src.config import SeeBorg4Config
from src.database import SeeBorg4Database
from src.seeborg4 import SeeBorg4

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
    database = SeeBorg4Database.load_database(config.database_path())
    database.create_tables()

    # Instantiate client
    client = discord.Client()

    # Instantiate bot and start it
    bot = SeeBorg4(client, config, database)
    bot.start()


if __name__ == '__main__':
    main()
