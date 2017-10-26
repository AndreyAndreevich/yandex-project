'use strict';

const ApplicationError = require('../controllers/error');

const DbModel = require('./dbModel');

class Cards extends DbModel {
	constructor() {
		super('card');
	}

	/**
	 * Добавляет карту
	 *
	 * @param {Object} card описание карты
	 * @returns {Promise.<Object>}
	 */
	async create(card) {
		const isDataValid = card
			&& Object.prototype.hasOwnProperty.call(card, 'cardNumber')
			&& Object.prototype.hasOwnProperty.call(card, 'balance');

		const cardNumber = card.cardNumber;
		const oldCard = await this.getBy({cardNumber});
		if (oldCard[0]) {
			const id = oldCard[0].id;
			oldCard[0].balance = card.balance;
			await this._update({id}, {balance: card.balance});
			return oldCard[0];
		}

		if (isDataValid) {
			const newCard = Object.assign({}, card, {
				id: await this._generateId()
			});

			await this._insert(newCard);
			return newCard;
		}


		throw ApplicationError('Card data is invalid', 400);
	}

	/**
	 * Удалет карту
	 * @param {Number} id идентификатор карты
	 */
	async remove(id) {
		const card = await this.get(id);
		if (!card) {
			throw ApplicationError(`Card with ID=${id} not found`, 404);
		}
		await this._remove(id);
	}

	/**
	 * Списание средств с карты
	 * @param {Number} id идентификатор карты
	 * @param {Number} sum сумма
	 */
	async withdraw(id, sum) {
		const card = await this.get(id);
		const newBalance = Number(card.balance) - Number(sum);

		await this._update({id}, {balance: newBalance});
	}

	/**
	 * Пополнение карты
	 * @param {Number} id идентификатор карты
	 * @param {Number} sum сумма
	 */
	async refill(id, sum) {
		const card = await this.get(id);
		const newBalance = Number(card.balance) + Number(sum);

		await this._update({id}, {balance: newBalance});
	}
}

module.exports = Cards;
