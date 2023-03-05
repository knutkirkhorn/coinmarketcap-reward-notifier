// eslint-disable-next-line import/no-unresolved
import got from 'got';
import getPackageUserAgent from 'package-user-agent';

const apiUrl = 'https://api.coinmarketcap.com/shop/v3/product/list';

export async function getLatestRewardCreationDate() {
	const packageUserAgent = await getPackageUserAgent();
	const {data} = await got.post(apiUrl, {
		json: {
			currentPage: 1,
			pageSize: 1,
			sortField: 'date'
		},
		headers: packageUserAgent
	}).json();

	return data.list[0].createDate;
}

export async function fetchNewRewards(oldCreationDate) {
	const packageUserAgent = await getPackageUserAgent();
	const {data} = await got.post(apiUrl, {
		json: {
			currentPage: 1,
			pageSize: 99_999,
			sortField: 'date'
		},
		headers: packageUserAgent
	}).json();

	const rewards = data.list;
	const newRewards = rewards.filter(reward => reward.createDate > oldCreationDate);
	const latestRewardCreationDate = data.list[0].createDate;

	return {latestRewardCreationDate, newRewards};
}
