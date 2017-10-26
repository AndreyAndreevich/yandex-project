'use strict';

const TransactionsModel = require('../../models/transactions');
const logger = require('../../../libs/logger')('get-transactions');


module.exports = async(ctx) => {
	try {
		let id = ctx.params['id'];
		logger.log('info',`Запрос на получение списка транзакций карты ${id}`);
		if (id.search(/^\d+$/) === -1) throw("Id должен быть числом");
		id = Number(id);
		ctx.body = await new TransactionsModel().getByCard(id);
	} catch(err) {
		logger.log('error', err);
		ctx.status = 400;
		ctx.message = '400 Bad request';
	}
};
