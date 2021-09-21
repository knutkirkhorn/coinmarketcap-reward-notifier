import got from 'got';
import httpHeader from './util.js';

const apiUrl = 'https://api.coinmarketcap.com/shop/v3/product/list';

export async function getLatestRewardCreationDate() {
    const {data} = await got.post(apiUrl, {
        json: {
            currentPage: 1,
            pageSize: 1,
            sortField: 'date'
        },
        headers: httpHeader
    }).json();

    return data.list[0].createDate;
}

export async function fetchNewRewards(oldCreationDate) {
    const {data} = await got.post(apiUrl, {
        json: {
            currentPage: 1,
            pageSize: 99999,
            sortField: 'date'
        },
        headers: httpHeader
    }).json();

    const rewards = data.list;
    const newRewards = rewards.filter(reward => reward.createDate > oldCreationDate);
    const latestRewardCreationDate = data.list[0].createDate;

    return {latestRewardCreationDate, newRewards};
}
