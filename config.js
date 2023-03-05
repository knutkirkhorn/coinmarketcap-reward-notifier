import dotenv from 'dotenv';

// Load the stored variables from `.env` file into process.env
dotenv.config();

// Default is 60 minutes for the wait timeout
const MILLISECONDS_IN_HOUR = 3_600_000;

export default {
	discordWebhookUrl: process.env.DISCORD_WEBHOOK_URL || '',
	discordWebhookId: process.env.DISCORD_WEBHOOK_ID || '',
	discordWebhookToken: process.env.DISCORD_WEBHOOK_TOKEN || '',
	waitTimeout: process.env.WAIT_TIMEOUT || MILLISECONDS_IN_HOUR
};
