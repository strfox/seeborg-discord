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

    >>> remove_empty(['', ' ', None, 'hello'])
    ['hello']
    """
    return list(
        filter(lambda x: x is not None and x != '' and x != ' ', str_arr))
