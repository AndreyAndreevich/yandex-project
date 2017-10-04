const fs = require('fs');
const path = require('path');
const {promisify} = require('util');

const Model = require('./model');

const writeFileAsync = promisify(fs.writeFile);

class fileModel extends Model{
	constructor(sourceFileName) {
		super();
		this._dataSourceFile = path.join(__dirname, '..', 'data', sourceFileName);
		this._dataSource = require(this._dataSourceFile);
	}
	async getAll () {
		return await this._dataSource;
	}

	async _saveUpdates () {
		let redactData = (JSON.stringify(this._dataSource, null, 4))
		return await writeFileAsync(this._dataSourceFile, redactData);
	}
}

module.exports = fileModel;
