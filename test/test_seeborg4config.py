from unittest import TestCase
from src.config import SeeBorg4Config

# Sample configuration with no channel overrides
sample_config_no_channel_override = {
    'token': '123',
    'databasePath': 'database.db',
    'behavior': {
        'speaking': True,
        'learning': False,
        'replyRate': 17.0,
        'replyMention': 31.0,
        'replyMagic': 57.0,
        'magicPatterns': [
            'h[uo]go'
        ],
        'blacklistedPatterns': [
            'chugg(er|a)'
        ],
        'ignoredUsers': [
            '12345678987654321',
            '98765432123456789'
        ]
    },
    'channelOverrides': [
        {
            'channelId': '12345',
            'behavior': {
                'speaking': False,
                'learning': True,
                'replyRate': 18.0,
                'replyMention': 31.0,
                'replyMagic': 57.0,
                'magicPatterns': [
                    'p[uo]h'
                ],
                'blacklistedPatterns': [
                    'black(list|ghost)'
                ],
                'ignoredUsers': [
                    '1325476980'
                ]
            }
        },
        {
            'channelId': '54321',
            'behavior': {
                'speaking': False
            }
        }
    ]
}


class TestSeeBorg4Config(TestCase):
    instance = None

    @classmethod
    def setUpClass(cls):
        # Instantiate a SeeBorg4Config with
        cls.instance = SeeBorg4Config(dict(sample_config_no_channel_override))

    def test_token(self):
        """
        token should return the token
        """
        self.assertEqual(self.instance.token(), '123')

    def test_database_path(self):
        """
        database_path should return the database_path
        """
        self.assertEqual(self.instance.database_path(), 'database.db')

    def test_is_ignored_user_in_ignore_list(self):
        """
        is_ignored should return true for a user that is in ignore list
        """
        self.assertTrue(self.instance.is_ignored('12345678987654321', None))

    def test_is_ignored_user_not_in_ignore_list(self):
        """
        is_ignored should return false for a user that is not in ignore list
        """
        self.assertFalse(self.instance.is_ignored('1111111111111111', None))

    def test_matches_blacklisted_pattern_matching(self):
        """
        matches_blacklisted_pattern should return true if string matches a
        blacklisted pattern
        """
        self.assertTrue(
            self.instance.matches_blacklisted_pattern(None, 'chugga'))

    def test_matches_blacklisted_pattern_not_matching(self):
        """
        matches_blacklisted_pattern should return false if string doesn't match
        any blacklisted pattern
        """
        self.assertFalse(
            self.instance.matches_blacklisted_pattern(None, 'grandma'))

    def test_matches_magic_pattern_matching(self):
        """
        matches_magic_pattern should return true if string matches a magic
        pattern
        """
        self.assertTrue(
            self.instance.matches_magic_pattern(None, 'hugo')
        )

    def test_matches_magic_pattern_not_matching(self):
        """
        matches_magic_pattern should return false if string doesn't match a
        magic pattern
        """
        self.assertFalse(
            self.instance.matches_magic_pattern(None, 'puddle')
        )

    def test_reply_rate(self):
        """
        reply_rate should return reply rate
        """
        self.assertEqual(self.instance.reply_rate(None), 17.0)

    def test_reply_mention(self):
        """
        reply_mention should return reply mention
        """
        self.assertEqual(self.instance.reply_mention(None), 31.0)

    def test_reply_magic(self):
        """
        reply_magic should return reply magic
        """
        self.assertEqual(self.instance.reply_magic(None), 57.0)

    def test_speaking(self):
        """
        speaking should return speaking
        """
        self.assertEqual(self.instance.speaking(None), True)

    def test_learning(self):
        """
        learning should return learning
        """
        self.assertEqual(self.instance.learning(None), False)

    def test_overridden_property(self):
        """
        property accessors should return overridden properties
        """
        # in this case we use speaking
        self.assertEqual(self.instance.speaking('12345'), False)