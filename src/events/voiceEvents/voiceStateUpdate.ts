import { MessageEmbed, VoiceState } from "discord.js";
import { BeccaInt } from "../../interfaces/BeccaInt";
import { sendLogEmbed } from "../../modules/guild/sendLogEmbed";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const voiceStateUpdate = async (
  Becca: BeccaInt,
  oldState: VoiceState,
  newState: VoiceState
): Promise<void> => {
  try {
    const voiceEmbed = new MessageEmbed();
    voiceEmbed.setTimestamp();
    voiceEmbed.setFooter(`ID: ${oldState.id}`);

    if (oldState.channelId && newState.channelId) {
      voiceEmbed.setTitle("Member switched channels!");
      voiceEmbed.setDescription(
        `<@!${oldState.id}> has moved from <#${oldState.channelId}> to <#${newState.channelId}>.`
      );
      voiceEmbed.setColor(Becca.colours.warning);
    }

    if (oldState.channelId && !newState.channelId) {
      voiceEmbed.setTitle("Member left voice channel!");
      voiceEmbed.setDescription(
        `<@!${oldState.id}> has left the <#${oldState.channelId}> channel.`
      );
      voiceEmbed.setColor(Becca.colours.error);
    }

    if (!oldState.channelId && newState.channelId) {
      voiceEmbed.setTitle("Member joined voice channel!");
      voiceEmbed.setDescription(
        `<@!${oldState.id}> has joined the <#${newState.channelId}> channel.`
      );
      voiceEmbed.setColor(Becca.colours.success);
    }

    await sendLogEmbed(Becca, oldState.guild, voiceEmbed);
  } catch (err) {
    beccaErrorHandler(Becca, "voice state update listener", err);
  }
};
