import argparse
import logging
import logging.config


def main():
    # Configure the logger
    logging.config.fileConfig('logging.conf')

    # Parse command-line arguments
    parser = argparse.ArgumentParser(description='SeeBorg4')
    parser.add_argument('-c', '--config', help='JSON config file', required=True)
    args = parser.parse_args()

    # 


if __name__ == '__main__':
    main()
