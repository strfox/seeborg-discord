from pony.orm import *

set_sql_debug(True)


class SeeBorg4Database:

    def __init__(self, filename):
        self.__filename = filename
        self.__db = Database()

    def init(self):
        self.__define_entities()
        self.__db.bind(provider='sqlite', filename=self.__filename,
                       create_db=True)
        self.__db.generate_mapping(create_tables=True)

    def __define_entities(self):
        db = self.__db  # Just an alias

        class Sentence(db.Entity):
            sentence = Required(str, unique=True)
            words = Set(lambda: Word)

        class Word(db.Entity):
            word = Required(str, unique=True)
            sentences = Set(lambda: Sentence)


if __name__ == '__main__':
    SeeBorg4Database('ok.sqlite').init()
