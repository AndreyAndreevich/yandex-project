'use strict';

const fs = require('fs');
const path = require('path');

const ApplicationError = require('../../controllers/error');
const FileModel = require('../fileModel');

class Transactions extends FileModel{
	constructor () {
		super('transactions.json');
	}

	//Добавляет транзакцию
	async create (transactions) {
		try {
			this._dataSource.push(transactions);
			await this._saveUpdates();
		}
		catch (err) {
			throw ApplicationError(('Err created : ' + err), 400);
		}
	}
}

module.exports = Transactions;
