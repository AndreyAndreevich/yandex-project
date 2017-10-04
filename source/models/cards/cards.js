'use strict';


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
			await this.loadFile();
			for (let i in this._dataSource)
				if (this._dataSource[i].cardNumber === card.cardNumber) {
					this._dataSource[i].balance = card.balance;
					flag = true;
					break;
				}
			if (!flag) {
				card.id = this._dataSource[this._dataSource.length - 1].id + 1;
				this._dataSource.push(card)
			}
			await this._saveUpdates();
			return card;
		}
		catch (err) {
			return ApplicationError(('Err created card: ' + err), 400);
		}
	}

	//Удаляет карту
	async remove (id) {
		try {
			await this.loadFile();
			if ((id > this._dataSource.length) | (id <= 0)) throw(`Не существует карты с id ${id}`);
			this._dataSource.splice(id - 1, 1);
			await this._saveUpdates();
			return true;
		} catch (err) {
			return ApplicationError(('Err deleted : ' + err), 400);
		}
	}
}

module.exports = Cards;
