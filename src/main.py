import argparse
import logging.config
import discord
import asyncio

from src.config import SeeBorg4Config
from src.database import SeeBorg4Database
from src.seeborg4 import SeeBorg4

# Configure the logger
logging.config.fileConfig('logging.conf')
logger = logging.getLogger(__name__)


def main():
    # Parse command-line arguments
    arg_parse = argparse.ArgumentParser(description='SeeBorg4')
    arg_parse.add_argument('-c', '--config', help='YAML config file', required=True)
    args = arg_parse.parse_args()

    config = SeeBorg4Config.load_config(args.config)
    database = SeeBorg4Database.load_database(config.database_path())
    client = discord.Client()

    bot = SeeBorg4(client, config, database)
    bot.start()


if __name__ == '__main__':
    main()
