import sqlite3
import logging


class SeeBorg4Database:

    def __init__(self, conn):
        self._conn = conn
        self._logger = logging.getLogger(SeeBorg4Database.__name__)
        self._logger.debug('Database created')

    def create_tables(self):
        cursor = self._conn.cursor()

        # Create sentences table
        cursor.execute("""
                CREATE TABLE IF NOT EXISTS tbl_sentences (
                  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                  sentence TEXT NOT NULL UNIQUE
                )
                """)

        # Create words table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS tbl_words (
              id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
              word TEXT NOT NULL UNIQUE
            )
            """)

        # Create many-to-many relationship table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS tbl_sentences_words (
              sentence_id INTEGER NOT NULL,
              word_id INTEGER NOT NULL,
              FOREIGN KEY (sentence_id) REFERENCES tbl_sentences(id),
              FOREIGN KEY (word_id) REFERENCES tbl_words(id)
            )
        """)

    @classmethod
    def load_database(cls, filename):
        """
        :param filename: ``str``
        :return: ``SeeBorg4Database``
        """
        return SeeBorg4Database(sqlite3.connect(filename))
