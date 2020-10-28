# SeeBorg-Discord

SeeBorg-Discord is my own version of the SeeBorg IRC chatbot by Eugene Bujak.
It works with Discord and was tested on Node.js v9.4.0.
It can learn from things other people say and make its own responses.
The results are usually amusing and sometimes can be creepy.

## BETA NOTES

* Voice recognition is still a work in progress.
* **Back up your dictionaries to prevent data loss in case of bugs.**
* **voiceSettings.responseFrequency**, **voiceSettings.channels.*** do not do anything yet.

## IMPORTANT

SeeBorg4 uses a different lines system from other versions of SeeBorg for its dictionary.
Instead of using a plain text file, sentences and words are now mapped inside a JSON file.

Before migrating, **back up your lines.**
It is possible to migrate your lines file using the migration tool. To use it, run **node tools/migrate.js** and follow the instructions. 

## Usage

0. You will need to install the latest version of [Node.js](https://nodejs.org/en/).
1. [Create a Discord application](https://discordapp.com/developers/applications/me) and create a user bot.  **Write your bot's token down somewhere safe.**
2. Download the bot code.
3. Run `install.bat`.
4. Edit `config.yml` and set the **token** property to the token you got on step 1.
5. Change the rest of the bot's configuration to your liking. (See: [YAML Syntax](https://learn.getgrav.org/advanced/yaml))
6. Migrate your dictionary from an older version of SeeBorg if needed.
7. Start the bot with `start.bat` and enjoy.

## Writing plugins

Plugins are supported as of SeeBorg 4.1 Beta 0. A plugin has three essential methods described below.
You should have a *minimum* understanding of JavaScript if you want to write plugins.

Required methods:
  - **Plugin#getName()**: Returns the name for the plugin
  - **Plugin#init(bot)**: Method called after the Plugin instance's construction. Any procedures related to initialization of the plugin should be placed here. The parameter bot is an instance of SeeBorg4. Properties of SeeBorg4 are declared in **src/seeborg4.js**.
  - **Plugin#destroy()**: Method called before SeeBorg4's shutdown. Any shutdown procedures should be placed here.

Plugins are to be placed in **plugins/** and they should be *exporting only the plugin class.*

## Useful documents

See FAQ and TROUBLESHOOTING.

## LICENSE

See LICENSE.
