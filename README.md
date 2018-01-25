# SeeBorg4
SeeBorg4 is my own version of the SeeBorg IRC chatbot by Eugene Bujak.
It works with Discord and was tested on Node.js v9.4.0.
It can learn from things other people say and make its own responses.
The results are usually amusing and sometimes can be creepy.

## Installation

0. You will need to install the latest version of [Node.js](https://nodejs.org/en/).
0. [Create a Discord application](https://discordapp.com/developers/applications/me) and create a user bot.
    - Write your bot's token down somewhere safe.
0. Clone the repository or download it as a ZIP. If you download as a ZIP, make sure to extract it.
0. Using the Command Prompt, navigate to the repository's folder and type `npm install` to install all the dependencies.
0. Duplicate `config.example.yml` and set the `token` property to the token you got on step 3.
0. Change the bot configuration to your liking. (See: [YAML Syntax](https://learn.getgrav.org/advanced/yaml))
0. Start the bot with `node src/main.js` and enjoy.
0. Read the section below if you are migrating from an older version.

## Important Note

SeeBorg4 uses a different lines system for its dictionary. Instead of using a text file,
sentences and words are now mapped inside a JSON file.

**BACKUP YOUR LINES.**

It is possible to migrate your lines file using the migration tool. To use it, run `node tools/migrate.js`
and follow the instructions. 

## LICENSE

See LICENSE.