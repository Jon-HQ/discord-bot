/* eslint-disable no-console */
import { isEthAddress } from '../utils/is-eth-address';
import CryptoJsHandler from '../utils/aes256-generator';
import { CommandInteraction, GuildMember } from 'discord.js';

export default async function linkWalletHandler(interaction: CommandInteraction) {
  const member = interaction.member as GuildMember;
  const address = interaction.options.getString('address');

  if (!isEthAddress(address)) {
    return await member.send('Invalid eth address!');
  }
  try {
    const encryptedData = new CryptoJsHandler(process.env.DISCORD_BOT_AES256_SECRET).encrypt(
      JSON.stringify({
        discordId: interaction.user.id,
        userAddress: address
      })
    );
    await member.send(`${process.env.FRONT_URL}/discord/linking?message=${encryptedData}`);
  } catch (err) {
    console.log(err);
    if (err.code === 50007) {
      return await interaction.reply(`
            Can't DM you, please change your privacity settings`);
    }
  }
}
