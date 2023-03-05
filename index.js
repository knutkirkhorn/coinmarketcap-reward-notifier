import discordWebhookWrapper from 'discord-webhook-wrapper';
import {Formatters, EmbedBuilder} from 'discord.js';
import {setTimeout} from 'node:timers/promises';
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

	const embedMessage = new EmbedBuilder()
		.setTitle('💎🤲 **New Reward**')
		.setThumbnail(reward.imageUrl)
		.addFields({name: 'Name', value: reward.name})
		.addFields({name: 'Price', value: `${reward.price}`})
		.addFields({name: 'Available', value: availableText});

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

		// eslint-disable-next-line no-restricted-syntax
		for (const newReward of newRewards) {
			await notifyNewReward(newReward);
		}
	} catch (error) {
		console.log(error);
	} finally {
		await setTimeout(config.waitTimeout);
	}
}
