import re

RE_SPLIT_WORDS = re.compile("\s+|[,.!?:]+(\s|$)+", re.M)
RE_SPLIT_SENTENCES = re.compile("(?<=[.!?])(\s+)", re.M)


def split_words(s):
    """
    :param s: ``str``
    :return: ``list[str]``
    """
    return remove_empty(RE_SPLIT_WORDS.split(s))


def split_sentences(s):
    """
    :param s: ``str``
    :return: ``list[str]``
    """
    return remove_empty(RE_SPLIT_SENTENCES.split(s))


def remove_empty(str_arr):
    """
    :param str_arr: ``list[str]``
    :return: ``list[str]``

    >>> remove_empty(['', ' ', '\\n', None, 'hello'])
    ['hello']
    """
    return list(
        filter(lambda x: x is not None and not x.isspace() and x is not '', str_arr))


def sentence_words_dict(line):
    """
    Converts the specified line into a dictionary of sentence keys and word list values.

    :param line: ``str``
    :return: ``dict[str, list[str]]``
    """
    # Get sentences from the line
    sentences = split_sentences(line)

    # Make a dictionary of sentences and their words
    return dict([(sentence, split_words(sentence)) for sentence in sentences])