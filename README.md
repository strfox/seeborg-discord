# SeeBorg4

SeeBorg4 is my own version of the SeeBorg IRC chatbot by Eugene Bujak.
It works with Discord and was tested on Node.js v9.4.0.
It can learn from things other people say and make its own responses.
The results are usually amusing and sometimes can be creepy.

## BETA NOTES

* Voice recognition is still a work in progress.
* **Back up your dictionaries to prevent data loss in case of bugs.**
* voiceSettings.responseFrequency, voiceSettings.channels.* do not do anything yet.

## IMPORTANT

SeeBorg4 uses a different lines system from other versions of SeeBorg for its dictionary. Instead of using a plain text file, sentences and words are now mapped inside a JSON file.

__BACKUP YOUR LINES.__

It is possible to migrate your lines file using the migration tool. To use it, run `node tools/migrate.js`
and follow the instructions. 

## Usage

0. You will need to install the latest version of [Node.js](https://nodejs.org/en/).
1. [Create a Discord application](https://discordapp.com/developers/applications/me) and create a user bot.  **Write your bot's token down somewhere safe.**
2. Clone the repository or download it as a zip archive.
  - If you downloaded the repository as a zip archive, then extract it.
3. Using the PowerShell or another CLI environment, navigate to the repository's folder and run **npm install** to install all the dependencies.
4. Duplicate **config.example.yml** and set the **token** property to the token you got on step 3.
5. Change the rest of the bot's configuration to your liking. (See: [YAML Syntax](https://learn.getgrav.org/advanced/yaml))
6. Migrate your dictionary from an older version of SeeBorg if needed.
7. Start the bot with **node src/main.js** and enjoy.

### (Voice Support) Install ffmpeg

#### Windows

0. [Download ffmpeg](https://www.ffmpeg.org/download.html)
1. Add the ffmpeg directory to your PATH.
  0. If you don't know how, then create the directory **C:\\Opt\\** if it doesn't already exist
  1. Put the ffmpeg dictory inside **C:\\Opt\\**
  2. On the Start menu, type "Edit the system environment variables".
  3. Click on "Edit the system environment variables".
  4. On the Advanced tab of the System Properties dialog box, click Environment Variables.
  5. In the **System Variables box** of the Environment Variables dialog box, scroll to Path and select it.
  6. Click the lower of the two Edit buttons in the dialog box.
  7. In the Edit System Variable dialog box, press the "Edit Text..." button and press OK if a warning appears.
  8. Scroll to the end of the string in the **Variable value** box and add a semicolon (;).
  9. Add the **C:\\Opt\\ffmpeg\\bin\\** after the semicolon.
  10. Click OK in three successive dialog boxes to finish and close everything.
2. Close and reopen any command-line environments to reload the PATH.
3. Check if ffmpeg is installed by running `ffmpeg` in the command-line. If you get an error, then you've probably goofed up somewhere.

#### Linux

If you're using Linux, then you can figure this out on your own.

### Using voice chat

To voice chat with your bot, ensure that:

0. That **voiceSettings.useVoice** is set to **true** in your configuration file.
1. That the bot has permissions to join voice channels and speak in them.
2. That your user ID is listed in your configuration's **voiceSettings.acceptInvitesFrom**.

Then, in any guild channel, mention the bot and follow the mention with a command.
**Example: "@MyBot /jvc"** - Will make the bot join the voice channel you're in.

**/jvc (The bot will join the voice channel you're in)**

**/qvc (The bot will quit any voice channels it's in)**

## Writing plugins

Plugins are supported as of SeeBorg 4.1 Beta 0. A plugin has three essential methods described below.
You should have a minimum understanding of JavaScript if you want to write plugins.

Required methods:
  - Plugin#getName(): Returns the name for the plugin
  - Plugin#init(bot): Method called after the Plugin instance's construction. Any procedures related to initialization of the plugin should be placed here. The parameter bot is an instance of SeeBorg4. Properties of SeeBorg4 are declared in src/seeborg4.js.
  - Plugin#destroy(): Method called before SeeBorg4's shutdown. Any shutdown procedures should be placed here.

Plugins are to be placed in **plugins/** and they should be exporting only the plugin class.

## Useful documents

See FAQ and TROUBLESHOOTING.

## LICENSE

See LICENSE.