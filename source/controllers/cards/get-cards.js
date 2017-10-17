'use strict';

const CardsModel = require('../../models/cards/cards');
const logger = require('../../../libs/logger')('get-card');


module.exports = async(ctx) => {
	logger.log('info','Запрос на получение списка кард');
	ctx.body = await new CardsModel().getAll();
};
