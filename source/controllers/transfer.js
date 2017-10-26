'use strict';

const CardsModel = require('../models/cards');
const TransactionsModel = require('../models/transactions');
const logger = require('../../libs/logger')('transfer');

const moment = require('moment');

module.exports = async(ctx) => {
	try {
		let data = ctx.request.body;
		const cardId1 = Number(ctx.params['id']);
		const cardId2 = Number(data.data);
		logger.log('info', `Запрос на перевод с карты ${cardId1} на карту ${data.data}`);
		if (!data | !Number(data.sum) | !cardId1 | !cardId2 | !(data.type === "card2Card")) throw ('Данные не заполнены');
		if (data.sum <= 0) throw ('Сумма перевода должна быть положительной');
		const cardsModel = await new CardsModel();
		let card2 = await cardsModel.get(cardId2);
		if (!card2) throw (`Нет карты с id ${cardId2}`);
		if (data.sum > card2.balance) throw (`Недостаточно средств на карте ${cardId2}`);
		let card1 = await cardsModel.get(cardId1);
		if (!card1) throw (`Нет карты с id ${cardId1}`);
		card2.balance = card2.balance - data.sum;
		card1.balance = card1.balance + data.sum;
		let transaction1 = {
			cardId: cardId1,
			type: "prepaidCard",
			data: card2.cardNumber,
			time: moment().format('YYYY-MM-DTHH:mm:ssZ'),
			sum: String(data.sum)
		};
		let transaction2 = {
			cardId: cardId2,
			type: data.type,
			data: card1.cardNumber,
			time: transaction1.time,
			sum: String(data.sum)
		};
		const transactionsModel = new TransactionsModel();
		let newCard1 = await cardsModel.create(card1);
		let newTransaction2 = await transactionsModel.create(transaction2);
		let newCard2 = await cardsModel.create(card2);
		let newTransaction1 = await transactionsModel.create(transaction1);
		let req = {
			balance1: newCard1.balance,
			balance2: newCard2.balance,
			transaction1: newTransaction1,
			transaction2: newTransaction2
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
