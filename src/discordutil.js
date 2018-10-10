"use strict";
const discord = require("discord.js");

/**
 * Returns true if the specified memeber is in the specified voice channel.
 *
 * @param {GuildMember} member The member
 * @param {VoiceChannel} voiceChannel The voice channel
 * @returns {boolean} Whether the member is in the voice channel
 */
function userIsInVoiceChannel(member, voiceChannel) {
  for (let snflkMember of voiceChannel.members) {
    const channelMember = snflkMember[1];
    if (channelMember.id === member.id) return true;
  }
  return false;
}

/**
 * Returns the voice channel the specified member is in, if there's one.
 *
 * @param {*} guild Guild to look in
 * @param {*} member Member to look for
 * @returns {?*} The voice channel, or null if not in any channel
 */
function findMemberVoiceChannel(guild, member) {
  for (let snflkChannel of guild.channels) {
    const channel = snflkChannel[1];
    if (channel instanceof discord.VoiceChannel && userIsInVoiceChannel(member, channel)) {
      return channel;
    } else {
      continue;
    }
  }
  return null;
}

module.exports = {
  userIsInVoiceChannel: userIsInVoiceChannel,
  findMemberVoiceChannel: findMemberVoiceChannel
};