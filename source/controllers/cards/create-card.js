'use strict';

const CardsModel = require('../../models/cards');
const logger = require('../../../libs/logger')('create-card');


module.exports = async(ctx) => {
	try {
		const card = {
//			id: 0,
			cardNumber: String(ctx.request.body.cardNumber),
			balance: String(ctx.request.body.balance)
		};
		logger.log('info','Получены данные карты');
		validationCard(card);
		card.balance = Number(card.balance);
		const cardsModel = new CardsModel();
		const newCard = await cardsModel.create(card);
		logger.log('info','Карта создана');
		ctx.status = 201;
		ctx.body = newCard;
	} catch (err) {
		logger.log('error',err);
		ctx.status = 400;
		ctx.message = '400 Bad request';
	}
};

const validationCard = (card) => {
		if (card.cardNumber.search(/^(\d{13}|\d{16}|\d{18,19})$/) === -1)
			throw ('Несоответсвие количества цифр номера карты');
		if (card.balance.search(/^\d+$/) === -1)
			throw('Баланс должен содержать только цифры');
};
