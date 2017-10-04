'use strict';

const CardsModel = require('../../models/cards/cards');

module.exports = async(ctx) => {
	ctx.body = await new CardsModel().getAll();
};
