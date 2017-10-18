'use strict';


const ApplicationError = require('../../controllers/error');
const FileModel = require('../fileModel');

class Transactions extends FileModel{
	constructor () {
		super('transactions.json');
	}

	//Добавляет транзакцию
	async create (transactions) {
		try {
			await this.loadFile();
			if (!this._dataSource.length) {
				transactions.id = 1;
			} else {
				transactions.id = this._dataSource[this._dataSource.length - 1].id + 1;
			}
			this._dataSource.push(transactions);
			await this._saveUpdates();
		}
		catch (err) {
			throw ApplicationError(('Err created transaction: ' + err), 400);
		}
	}
}

module.exports = Transactions;
