# 4.1 Beta 0

* Voice chat support (text-to-speech)
* Plugin support
* Automatic saving when ending the bot with CTRL+C
* Automatic reconnection when connection is lost
* Better console messages
* Disabled debug messages by default
* Update winston to 3.1.0
* Database writes atomically, therefore reducing the chance of database corruption

# 4.0.4_1

* Fixed a bug where the bot wouldn't talk at all if the guild had Send Messages permissions for the bot off, but
specific channel overrides for it.

# 4.0.3

* The bot no longer vomits garbage when it hears a word it doesn't know.

# 4.0.2_1

* Really fixed bot crashing when receiving a DM

# 4.0.2
* Fixed bot crashing when receiving a DM

# 4.0.1
* Fixed an issue where the bot would sometimes crash when unable to send messages to a channel

# 4.0.0
* Initial release