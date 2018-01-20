from unittest import TestCase
from src.stringutil import split_sentences, split_words, sentence_words_dict


class TestSplitWords(TestCase):
    def test_spaces(self):
        """
        split_words should split at spaces
        """
        self.assertListEqual(
            split_words('     the quick brown      fox     '),
            ['the', 'quick', 'brown', 'fox']
        )

    def test_punctuation(self):
        """
        split_words should remove punctuation
        """
        self.assertListEqual(
            split_words('the. quick?????? brown, fox....... .!!!.'),
            ['the', 'quick', 'brown', 'fox']
        )

    def test_link(self):
        """
        split_words should keep links intact
        """
        self.assertListEqual(
            split_words(
                'https://www.google.com/search?q=kittens$love&stuff'
                '=complicated'),
            ['https://www.google.com/search?q=kittens$love&stuff=complicated']
        )


class TestSplitSentences(TestCase):
    def test_regular_line(self):
        """
        split_sentences should split at every final punctuation
        """
        self.assertListEqual(
            split_sentences(
                'hello world! my name is: andro... really? i didn\'t, know!'),
            ['hello world!', 'my name is: andro...', 'really?',
             'i didn\'t, know!']
        )


class TestSentenceWordsDict(TestCase):
    def test_sentence(self):
        """
        sentence_words_dict should return correct value
        """
        self.assertEqual(
            sentence_words_dict('the quick, brown! fox? jumped over.'),
            {
                'the quick, brown!': ['the', 'quick', 'brown'],
                'fox?': ['fox'],
                'jumped over.': ['jumped', 'over']
            }
        )
