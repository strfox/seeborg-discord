import argparse
import logging
import logging.config
from src.conf.config import SeeBorg4Config

# Configure the logger
logging.config.fileConfig('logging.conf')
logger = logging.getLogger(__name__)


def main():
    # Parse command-line arguments
    arg_parse = argparse.ArgumentParser(description='SeeBorg4')
    arg_parse.add_argument('-c', '--config', help='YAML config file', required=True)
    args = arg_parse.parse_args()

    # Load config
    config = SeeBorg4Config.load_config(args.config)
    logger.debug(config)


if __name__ == '__main__':
    main()
