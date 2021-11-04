import {MessageEmbed, WebhookClient} from 'discord.js';
// eslint-disable-next-line import/no-unresolved
import {setTimeout} from 'timers/promises';
import {fetchNewRewards, getLatestRewardCreationDate} from './coinmarketcap.js';
import config from './config.js';

const {discordWebhookUrl, discordWebhookId, discordWebhookToken} = config;

// Check if either Discord Webhook URL or Discord Webhook ID and token is provided
if (!(discordWebhookUrl || (discordWebhookId !== '' && discordWebhookToken !== ''))) {
    throw new Error('You need to specify either Discord Webhook URL or both Discord Webhook ID and token!');
}

const webhookClient = discordWebhookUrl ? new WebhookClient({url: discordWebhookUrl}) : new WebhookClient({id: discordWebhookId, token: discordWebhookToken});
const webhookUsername = 'CoinMarketCap Reward Notifier';

function createDynamicDiscordTimestamp(date) {
    const unixTime = Math.round(date.getTime() / 1000);
    return `<t:${unixTime}:R>`;
}

async function notifyNewReward(reward) {
    let avaiableText = 'Now';

    // Check if reward is scheduled to be released at a later time
    if (reward.saleStartTime && new Date() < new Date(reward.saleStartTime)) {
        avaiableText = createDynamicDiscordTimestamp(new Date(reward.saleStartTime));
    }

    const embedMessage = new MessageEmbed()
        .setTitle('💎🤲 **New Reward**')
        .setThumbnail(new URL(reward.imageUrl))
        .addField('Name', reward.name)
        .addField('Price', `${reward.price}`)
        .addField('Available', avaiableText);

    await webhookClient.send({
        username: webhookUsername,
        embeds: [embedMessage]
    });
}

(async () => {
    let latestRewardCreationDate = await getLatestRewardCreationDate();

    // Make it run forever
    while (true) {
        try {
            console.log('Checking for rewards at:', new Date());

            // eslint-disable-next-line no-await-in-loop
            const {latestRewardCreationDate: latestCreationDate, newRewards} = await fetchNewRewards(latestRewardCreationDate);
            latestRewardCreationDate = latestCreationDate;

            for (let i = 0; i < newRewards.length; i++) {
                // eslint-disable-next-line no-await-in-loop
                await notifyNewReward(newRewards[i]);
            }
        } catch (error) {
            console.log(error);
        } finally {
            // eslint-disable-next-line no-await-in-loop
            await setTimeout(config.waitTimeout);
        }
    }
})();
