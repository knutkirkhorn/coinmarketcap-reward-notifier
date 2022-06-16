import discordWebhookWrapper from 'discord-webhook-wrapper';
import {Formatters, MessageEmbed} from 'discord.js';
import {setTimeout} from 'timers/promises';
import {fetchNewRewards, getLatestRewardCreationDate} from './coinmarketcap.js';
import config from './config.js';

const webhookClient = discordWebhookWrapper(config);
const webhookUsername = 'CoinMarketCap Reward Notifier';

async function notifyNewReward(reward) {
    let availableText = 'Now';

    // Check if reward is scheduled to be released at a later time
    if (reward.saleStartTime && new Date() < new Date(reward.saleStartTime)) {
        availableText = Formatters.time(new Date(reward.saleStartTime), Formatters.TimestampStyles.RelativeTime);
    }

    const embedMessage = new MessageEmbed()
        .setTitle('💎🤲 **New Reward**')
        .setThumbnail(new URL(reward.imageUrl))
        .addField('Name', reward.name)
        .addField('Price', `${reward.price}`)
        .addField('Available', availableText);

    await webhookClient.send({
        username: webhookUsername,
        embeds: [embedMessage]
    });
}

let latestRewardCreationDate = await getLatestRewardCreationDate();

// Make it run forever
while (true) {
    try {
        console.log('Checking for rewards at:', new Date());

        const {latestRewardCreationDate: latestCreationDate, newRewards} = await fetchNewRewards(latestRewardCreationDate);
        latestRewardCreationDate = latestCreationDate;

        for (let i = 0; i < newRewards.length; i++) {
            await notifyNewReward(newRewards[i]);
        }
    } catch (error) {
        console.log(error);
    } finally {
        await setTimeout(config.waitTimeout);
    }
}
