# SeeBorg4
SeeBorg4 is my own version of the SeeBorg IRC chatbot by Eugene Bujak.
It works with Discord and was tested on Node.js v9.4.0.
It can learn from things other people say and make its own responses.
The results are usually amusing and sometimes can be creepy.

# Installation

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

__BACKUP YOUR LINES.__

It is possible to migrate your lines file using the migration tool. To use it, run `node tools/migrate.js`
and follow the instructions. 

# F.A.Q.

## Q: How do I migrate my old lines file to the new version?

In the installation guide, read and follow the instructions in the __Important Note__ section.

## Q: Can I edit the dictionary manually?

Yes, but you will need to run the rebuild script to rebuild the dictionary mappings. To run the tool, run `node tools/rebuild.js` and follow the instructions.

## Q: I'm getting an error related to the configuration (YAMLException).

SeeBorg4 uses the YAML file format for its configuration. Please take a look at an introduction to the YAML Syntax. A good resource might be: https://learnxinyminutes.com/docs/yaml/

## Q: The command prompt automatically closes itself and I can't see what was in it.

Programs in Windows will close as soon as they are done. Therefore it is recommended that you run the command from the command prompt or, if you are running it from a batch script, you can add `pause` to your script to make it not close automatically.

## Q: The bot crashes when my connection goes out.

Currently I don't know a fix for that. If you do, please make a pull request for the fix. But as a workaround, try `forever`. To install `forever`, run the command `npm install -g forever` and then run the bot with `forever start -l logs.txt src/main.js`. This will ensure the bot will automatically restart once it crashes. For documentation on `forever`, see https://github.com/foreverjs/forever.

## Q: What is the recommended reply rate for the bot?

For channels that are public and with bot chatter in mind, anything below 50% would be fine. For channels where regular users chat as well, I've found that a replyrate of 1% is ideal.

## Q: Can I edit the code?

Yes, the code is free for anyone to edit. You can fork the repository on GitHub. The only condition is that you have to include my license and give proper credit.

## Q: What permissions does the bot need?

Technically, the bot requires no permissions. But ideally it should have permissions to read and send messages.

## Q: How do I make the bot ping other people?

This is not supported.

## Q: The bot crashed. What do I do?

Contact me on Discord and include the __full__ crash log __as text__. Please avoid sending me screenshots and pictures. You can also open an issue in GitHub.

# LICENSE

See LICENSE.