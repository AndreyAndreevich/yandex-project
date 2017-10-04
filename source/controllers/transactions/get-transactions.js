'use strict';

const TransactionsModel = require('../../models/transactions/transactions');
const logger = require('../../../libs/logger')('get-transactions');


module.exports = async(ctx) => {
	try {
		const id = ctx.params['id'];
		logger.log('info',`Запрос на получение списка транзакций карты ${id}`);
		if (id.search(/^\d+$/) === -1) throw("Id должно быть числом");
		let transactionsMas = await new TransactionsModel().getAll();
		let trueMas = [];
		transactionsMas.forEach(async(item, i, arr) => {
			await Promise.resolve();
			if (item.cardId === ctx.params.id)
				trueMas.push(item);
		});
		ctx.body = trueMas;
	} catch(err) {
		logger.log('error', err);
		ctx.status = 400;
		ctx.message = '400 Bad request';
	}
};
