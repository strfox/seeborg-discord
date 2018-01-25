import re

RE_SPLIT_WORDS = re.compile("\s+|[,.!?:]+(\s|$)+", re.M)
RE_SPLIT_SENTENCES = re.compile("(?<=[.!?])(\s+)", re.M)


def split_words(s):
    return remove_empty(RE_SPLIT_WORDS.split(s))


def split_sentences(s):
    return remove_empty(RE_SPLIT_SENTENCES.split(s))


def remove_empty(str_arr):
    """
    >>> remove_empty(['', ' ', '\\n', None, 'hello'])
    ['hello']
    """
    return list(
        filter(lambda x: x is not None and not x.isspace() and x is not '', str_arr))