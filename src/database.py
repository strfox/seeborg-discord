import sqlite3
import logging

from src.stringutil import sentence_words_dict


class SeeBorg4Database():

    def __init__(self, conn):
        """
        :param conn: ``sqlite3.Connection``
        """
        self.__con = conn
        self.__cur = conn.cursor()
        self.__logger = logging.getLogger(SeeBorg4Database.__name__)

    @staticmethod
    def load_database(filename):
        """
        :param filename: ``str``
        :return: ``SeeBorg4Database``
        """
        db = SeeBorg4Database(sqlite3.connect(filename))
        db.__create_tables()
        return db

    def close(self):
        self.__con.close()

    def insert_line(self, line):
        """
        Inserts the specified line into the database.

        :param line: ``str``
        """
        dict_ = sentence_words_dict(line)

        for sentence, words in dict_.values():
            self.__cur.execute("""
                INSERT INTO tbl_sentences VALUES(NULL, ?)
            """, sentence)

            print(self.__last_insert_id())

    def __last_insert_id(self):
        self.__cur.execute('SELECT last_insert_rowid()')
        return self.__cur.fetchone()

    def __create_tables(self):
        """
        Creates the required tables in the database.
        """
        self.__logger.debug('__create_tables called')

        # Create sentences table
        self.__cur.execute("""
                        CREATE TABLE IF NOT EXISTS tbl_sentences (
                          id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                          sentence TEXT NOT NULL UNIQUE
                        )
                        """)

        # Create words table
        self.__cur.execute("""
                    CREATE TABLE IF NOT EXISTS tbl_words (
                      id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                      word TEXT NOT NULL UNIQUE
                    )
                    """)

        # Create many-to-many relationship table
        self.__cur.execute("""
                    CREATE TABLE IF NOT EXISTS tbl_sentences_words (
                      sentence_id INTEGER NOT NULL,
                      word_id INTEGER NOT NULL,
                      FOREIGN KEY (sentence_id) REFERENCES tbl_sentences(id),
                      FOREIGN KEY (word_id) REFERENCES tbl_words(id)
                    )
                """)

        self.__con.commit()


if __name__ == '__main__':
    db = SeeBorg4Database.load_database('dictionary.db')
    db.insert_line('hello world!')