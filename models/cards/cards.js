'use strict';

const fs = require('fs');
const path = require('path');

const ApplicationError = require('../../controllers/error');
const FileModel = require('../fileModel');

class Cards extends FileModel{
	constructor () {
		super('cards.json');
	}

	//Добавляет карту
	async create (card) {
		try {
			let flag = false;
			for (let i in this._dataSource)
				if (this._dataSource[i].cardNumber == card.cardNumber) {
					this._dataSource[i].balance = card.balance;
					flag = true;
					break;
				}
			if (!flag) {
				this._dataSource.push(card)
			}
			await this._saveUpdates();
			return card;
		}
		catch (err) {
			throw ApplicationError(('Err created : ' + err), 400);
		}
	}

	//Удаляет карту
	async remove (id) {
		try {
			let masCard = this._dataSource;
			if ((id > this._dataSource.length) | (id <= 0)) throw(`Не существует карты с id ${id}`);
			this._dataSource.splice(id - 1, 1);
			await this._saveUpdates();
		} catch (err) {
			throw ApplicationError(('Err deleted : ' + err), 400);
		}
	}
}

module.exports = Cards;
