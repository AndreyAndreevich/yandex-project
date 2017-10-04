'use strict';

const CardsModel = require('../models/cards/cards');
const TransactionsModel = require('../models/transactions/transactions');
const logger = require('../../libs/logger')('topup');

const moment = require('moment');

module.exports = async(ctx) => {
	try {
		let data = ctx.request.body;
		const cardId1 = Number(ctx.params['id']);
		const cardId2 = data.data;
		logger.log('info',`Запрос на перевод с карты ${cardId1} на карту ${data.data}`);
		if (data.sum <= 0) throw ('Сумма перевода долна быть положительной');
		const cardsModel = await new CardsModel();
		const cards = await cardsModel.getAll();
		let card1, card2;
		let flag = true;
		for (let i = 0; i < cards.length; i++) {
			if (cards[i].id === cardId2) {
				card2 = cards[i];
				card2.balance = card2.balance - data.sum;
				flag = false;
			}
		};
		if (flag) throw (`Нет карты с id ${cardId2}`);
		if (card2.balance < 0) throw ('Недостаточно средств на карте');

		flag = true;
		for (let i = 0; i < cards.length; i++) {
			if (cards[i].id === cardId1) {
				card1 = cards[i];
				card1.balance = card1.balance + data.sum;
				flag = false;
			}
		}
		if (flag) throw (`Нет карты с id ${cardId1}`);
		let transaction1 = {
			id: 0,
			cardId: cardId1,
			type: "prepaidCard",
			data: card2.cardNumber,
			time: moment().format('YYYY-MM-DTHH:mm:ssZ'),
			sum: String(data.sum)
		};
		let transaction2 = {
			id: 0,
			cardId: cardId2,
			type: data.type,
			data: card1.cardNumber,
			time: transaction1.time,
			sum: String(data.sum)
		};
		const transactionsModel = await new TransactionsModel();
		let newCard1 = await cardsModel.create(card1);
		await transactionsModel.create(transaction2);
		let newCard2 = await cardsModel.create(card2);
		await transactionsModel.create(transaction1);
		let req = {
			balance1: newCard1.balance,
			balance2: newCard2.balance,
			transaction1: transaction1,
			transaction2: transaction2
		};
		logger.log('info','Перевод произведен');
		ctx.status = 201;
		ctx.body = req;
	} catch (err) {
		logger.log('error', err);
		ctx.status = 400;
		ctx.message = '400 Bad request';
	}
};
