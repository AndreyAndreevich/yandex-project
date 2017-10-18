'use strict';

const CardsModel = require('../../models/cards/cards');
const logger = require('../../../libs/logger')('delete-card');

module.exports = async(ctx) => {
	try {
		let cardId = ctx.params['id'];
		logger.log('info',`Запрос на удаление карты ${cardId}`);
		if (cardId.search(/^\d+$/) === -1) throw("Id должно быть числом");
		cardId = Number(cardId);
		const cardsModel = new CardsModel();
		await cardsModel.remove(cardId);
		logger.log('info','Карта удалена');
		ctx.status = 200;
	} catch (err) {
		logger.log('error',err);
		ctx.status = 404;
		ctx.message = '404 Card not found';
	}
};
