from unittest import TestCase
from src.stringutil import split_sentences, split_words


class TestSplitWords(TestCase):
    def test_splits_at_spaces(self):
        self.assertListEqual(
            split_words('     the quick brown      fox     '),
            ['the', 'quick', 'brown', 'fox']
        )

    def test_removes_punctuation(self):
        self.assertListEqual(
            split_words('the. quick?????? brown, fox....... .!!!.'),
            ['the', 'quick', 'brown', 'fox']
        )

    def keeps_links(self):
        self.assertListEqual(
            split_words('https://www.google.com/search?q=kittens$love&stuff=complicated'),
            ['https://www.google.com/search?q=kittens$love&stuff=complicated']
        )


class TestSplitSentences(TestCase):
    def test_splits_at_final_punctuation(self):
        self.assertListEqual(
            split_sentences('hello world! my name is: andro... really? i didn\'t know!'),
            ['hello world!', 'my name is: andro...', 'really?', 'i didn\'t know!']
        )
