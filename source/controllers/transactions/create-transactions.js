'use strict';

const TransactionsModel = require('../../models/transactions/transactions');
const CardsModel = require('../../models/cards/cards');
const logger = require('../../../libs/logger')('create-transactions');


module.exports = async(ctx) => {
	try {
		let transactions = {
			id: 0,
			cardId: ctx.params.id,
			type: ctx.request.body.type,
			data: ctx.request.body.data,
			time: ctx.request.body.time,
			sum: ctx.request.body.sum
		};
		logger.log('info','Получены данные транзакции');
		await validationTransactions(transactions);
		transactions.cardId *= 1;
		const transactionsModel = await new TransactionsModel();
		await transactionsModel.create(transactions);
		logger.log('info','Транзакция добавлена');
		ctx.status = 200;
	} catch (err) {
		logger.log('error',err);
		ctx.status = 400;
		ctx.message = '400 Bad request';
	}
};

const validationTransactions = (transactions) => new Promise(async(resolve, reject) => {
	try {
		let id = transactions.cardId;
		if (id.search(/^\d+$/) === -1) throw('cardId должен быть числом');
		let masCard = await new CardsModel().getAll();
		if ((id > masCard.length) | (id <= 0)) throw(`Не существует карты с id: ${id}`);
		let type = ["paymentMobile", "prepaidCard", "card2Card"];
		if (type.indexOf(transactions.type) === -1)
			throw(`Недопустимое поле type: ${transactions.type}`);
		if (transactions.data.search(/^\d+$/) === -1) throw('Поле data должно быть числом');
		//valid transactions.time
		if (transactions.sum.search(/^\d+$/) === -1) throw('Поле sum должно быть числом');
		resolve(true);
	} catch(err) {
		return reject(err);
	}
});
