from pony.orm import *

set_sql_debug(True)
__db = Database()


class Sentence(__db.Entity):
    sentence = Required(str, unique=True)
    words = Set(lambda: Word)


class Word(__db.Entity):
    word = Required(str, unique=True)
    sentences = Set(lambda: Sentence)


def load(filename):
    """
    Loads the database.

    :param filename: ``str``
    """
    __db.bind(provider='sqlite', filename=filename, create_db=True)
    __db.generate_mapping(create_tables=True)


# @db_session
# def test():
#     s = Sentence(sentence='hello!', words=[])
#     commit()


if __name__ == '__main__':
    load('test.sqlite')