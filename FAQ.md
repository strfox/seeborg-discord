# Table of Contents

0. [How do I migrate my old lines file to the new version?](#migrate)
1. [Can I edit the dictionary manually?](#edit-dict)
2. [What is the recommended reply rate for the bot?](#rec-reply-rate)
3. [Can I edit the code?](#edit-code)
4. [What permissions does the bot need?](#permissions)
5. [How do I make the bot ping other people?](#ping)
6. [The bot crashed. What do I do?](#crashed)
7. [How do I block users?](#block)
8. [How do I get someone's or a channel's ID?](#getid)

---

<a name="migrate"></a>

### How do I migrate my old lines file to the new version?

In the installation guide, read and follow the instructions in the __IMPORTANT__ section.

<a name="edit-dict"></a>

### Can I edit the dictionary manually?

Yes, but you will need to run the rebuild script to rebuild the dictionary mappings. To run the tool, run **node tools/rebuild.js** and follow the instructions.

<a name="rec-reply-rate"></a>

### What is the recommended reply rate for the bot?

For channels that are public and with bot chatter in mind, anything below 50% would be fine. For channels where regular users chat as well, I've found that a replyrate of 1% is ideal.

<a name="edit-code"></a>

### Can I edit the code?

Yes, the code is free for anyone to edit. You can fork the repository on GitHub. The only condition is that you have to include my license and give proper credit.

<a name="permissions"></a>

### What permissions does the bot need?

Technically, the bot requires no permissions. But ideally it should have permissions to read and send messages. If you want to use voice chat, then the bot should have permission to join voice channels, listen and speak.

<a name="ping"></a>

### How do I make the bot ping other people?

This is not supported.

<a name="crashed"></a>

### The bot crashed. What do I do?

First, try to figure out the issue by yourself and use the information on the README, the FAQ and the TROUBLESHOOTING document to its fullest extent.
If you do not manage to solve the problem yourself, contact me on Discord and include the __full__ crash log __as text__.
Please avoid sending me screenshots and pictures. If you prefer, you can also open an issue in GitHub.

If there is no solution for the issue, create a script to restart the bot when it crashes or use [forever](https://www.npmjs.com/package/forever).

<a name="block"></a>

### How do I block users?

Put their user ID in ignoredUsers, under behavior.

<a name="getid"></a>

### How do I get someone's or a channel's ID?

In Discord, enable Developer Mode by going to Settings -> Appearance -> Enable Developer mode. Then, right click a channel or a user and click "Copy ID".
