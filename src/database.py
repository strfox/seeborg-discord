from pony.orm import *

from stringutil import split_sentences, split_words

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
            sentence_text = Required(str, unique=True)
            words = Set(lambda: Word)

        class Word(db.Entity):
            word_text = Required(str, unique=True)
            sentences = Set(lambda: Sentence)

    @db_session
    def insert_line(self, line_str):
        """
        Inserts a line into the database.

        :param line_str: ``str``
        """
        sentences_list_str = split_sentences(line_str)
        for sentence_text in sentences_list_str:
            sentence_ent = self.__find_sentence_entity_or_create(sentence_text)
            for word in split_words(sentence_text):
                
                
    def __find_sentence_entity_or_create(self, sentence_text):
        """
        Finds a sentence by the specified sentence text or creates a new one.
        
        :param sentence_text: ``str``
        """
        sentence_ent = self.__db.Sentence.get(sentence_text=sentence_text)
        if sentence_ent is None:
            sentence_ent = self.__db.Sentence(sentence_text=sentence_text, words=set())
        return sentence_ent
        
    def __find_entity_entity_or_create(self, word_text):
    """
        Finds a sentence by the specified word text or creates a new one.
        
        :param word_text: ``str``
        """
        word_ent = self.__db.Word.get(word_text=word_text)
        if word_ent is None:
            word_ent = self.__db.Word(word_text=word_text, sentences=set())
        return word_ent

if __name__ == '__main__':
    sdb = SeeBorg4Database('ok.sqlite')
    sdb.init()
    sdb.insert_line('hey all')