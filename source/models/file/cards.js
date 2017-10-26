'use strict';


const ApplicationError = require('../../controllers/error');
const FileModel = require('../fileModel');

class Cards extends FileModel{
	constructor () {
		super('file.json');
	}

	//Добавляет карту
	async create (card) {
		try {
			let flag = false;
			await this.loadFile();
			for (let i in this._dataSource)
				if (this._dataSource[i].cardNumber === card.cardNumber) {
					this._dataSource[i].balance = card.balance;
					card.id = this._dataSource[i].id;
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
			throw ApplicationError(('Err created card: ' + err), 400);
		}
	}

	//Удаляет карту
	async remove (id) {
		try {
			await this.loadFile();
			let flag = false;
			for (let i in this._dataSource)
				if (this._dataSource[i].id === id) {
					this._dataSource.splice(i, 1);
					flag = true;
					break;
				}
			if (!flag) throw(`Не существует карты с id ${id}`);
			await this._saveUpdates();
			return true;
		} catch (err) {
			throw ApplicationError(('Err deleted : ' + err), 400);
		}
	}
}

module.exports = Cards;
