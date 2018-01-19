from unittest import TestCase
from unittest.mock import MagicMock
from src.seeborg4 import SeeBorg4


class TestSeeBorg4(TestCase):

    seeborg4 = None
    client = None
    config = None
    database = None

    @classmethod
    def setUpClass(cls):
        cls.client = {}
        cls.config = {}
        cls.database = {}
        cls.seeborg4 = SeeBorg4(cls.client, cls.config, cls.database)

    def test__reply(self):
        self.fail()

    def test__should_process(self):
        self.fail()

    def test__should_learn(self):
        self.fail()

    def test__should_reply(self):
        self.fail()

    def test__is_own_message(self):
        self.fail()

    def test__has_magic_word(self):
        self.fail()

    def test__learn(self):
        self.fail()
