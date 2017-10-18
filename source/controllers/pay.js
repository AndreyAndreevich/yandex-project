'use strict';

const CardsModel = require('../models/cards/cards');
const TransactionsModel = require('../models/transactions/transactions');
const logger = require('../../libs/logger')('pay');

const moment = require('moment');

module.exports = async(ctx) => {
	try {
		const sum = Number(ctx.request.body.sum);
		const type = ctx.request.body.type;
		const data = ctx.request.body.data;
		const cardId = Number(ctx.params['id']);
		logger.log('info',`Запрос на оплату по карте ${cardId}`);
		if (!sum | !type | !data | !cardId) throw ('Данные не заполнены');
		if (sum <= 0) throw ('Сумма оплаты долна быть положительной');
		let flag = true;
		const cardsModel =  new CardsModel();
		let cards = await cardsModel.getAll();
		let card;
		for (let i = 0; i < cards.length; i++) {
			if (cards[i].id === cardId) {
				card = cards[i];
				card.balance = card.balance - sum;
				flag = false;
			}
		}
		if (flag) throw (`Нет карты с id ${cardId}`);
		if (card.balance < 0) throw ('Недостаточно средств на карте');
		let transaction = {
			id: 0,
			cardId: cardId,
			type: type,
			data: data,
			time: moment().format('YYYY-MM-DTHH:mm:ssZ'),
			sum: sum
		};
		const newCard = await cardsModel.create(card);
		const transactionsModel = new TransactionsModel();
		await transactionsModel.create(transaction);
		const req = {
			card: newCard,
			transaction: transaction
		};
		logger.log('info','Оплата произведена');
		ctx.status = 201;
		ctx.body = req;
	} catch (err) {
		logger.log('error', err);
		ctx.status = 400;
		ctx.message = '400 Bad request';
	}
};
