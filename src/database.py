from pony.orm import *

from stringutil import split_sentences, split_words

set_sql_debug(True)
__db = Database()


class Sentence(__db.Entity):
    sentence_text = Required(str, unique=True)
    words = Set(lambda: Word)


class Word(__db.Entity):
    word_text = Required(str, unique=True)
    sentences = Set(lambda: Sentence)


def init_db(filename):
    __db.bind(provider='sqlite', filename=filename, create_db=True)
    __db.generate_mapping(create_tables=True)


@db_session
def insert_line(line_str):
    """
    Inserts a line into the database.

    :param line_str: ``str``
    """
    sentences_list_str = split_sentences(line_str)
    for sentence_text in sentences_list_str:
        sentence_ent = __find_sentence_entity_or_create(sentence_text)
        for word_text in split_words(sentence_text):
            word_ent = __find_word_entity_or_create(word_text)
            sentence_ent.words.add(word_ent)
            word_ent.sentences.add(sentence_ent)

    __db.commit()


@db_session
def sentences_with_word(word_text, amount):
    """
    Returns ``amount`` number of sentences with the specified word.

    :param word_text: ``int``
    :param amount: ``int``
    :return: ``list[str]``
    """
    if amount < 1:
        raise ValueError('amount cannot be less than 1')
    sentence_ent_list = Sentence.select(
        lambda s: word_text in (word.word_text for word in s.words)).random(amount)[:amount]
    return (sentence_ent.sentence_text for sentence_ent in sentence_ent_list)


@db_session
def __find_sentence_entity_or_create(sentence_text):
    """
    Finds a sentence by the specified sentence text or creates a new one.

    :param sentence_text: ``str``
    """
    sentence_ent = Sentence.get(sentence_text=sentence_text)
    if sentence_ent is None:
        sentence_ent = Sentence(sentence_text=sentence_text, words=set())
    return sentence_ent


@db_session
def __find_word_entity_or_create(word_text):
    """
    Finds a sentence by the specified word text or creates a new one.

    :param word_text: ``str``
    """
    word_ent = Word.get(word_text=word_text)
    if word_ent is None:
        word_ent = Word(word_text=word_text, sentences=set())
    return word_ent


if __name__ == '__main__':
    init_db('test.sqlite')
    # insert_line(
    #     'hello everyone! my name is androfox. i am a cool dude! of course, you already knew
    # that. '
    #     'androfox is a cool dude.')
    print(list(sentences_with_word('androfox', 3)))
