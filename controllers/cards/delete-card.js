'use strict';

const CardsModel = require('../../models/cards/cards');

module.exports = async(ctx) => {
	try {
		const cardId = ctx.params['id'];
		if (cardId.search(/^\d+$/) == -1) throw("Id должно быть числом");
		const cardsModel = await new CardsModel();
		await cardsModel.remove(cardId);
		ctx.status = 200;
	} catch (err) {
		console.log(err);
		ctx.status = 404;
		ctx.message = '404 Card not found';
	}
};
