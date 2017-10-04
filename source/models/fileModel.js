const fs = require('fs');
const path = require('path');
const {promisify} = require('util');

const Model = require('./model');

const writeFileAsync = promisify(fs.writeFile);
const readFileAsync = promisify(fs.readFile);

const ApplicationError = require('../controllers/error');

class fileModel extends Model{
	constructor(sourceFileName) {
		super();
		this._dataSourceFile = path.join(__dirname, '..', 'data', sourceFileName);
	}

	async loadFile() {
		try {
			let data = await readFileAsync(this._dataSourceFile);
			this._dataSource = JSON.parse(data);
		} catch (err) {
			return ApplicationError(('Err load file : ' + err), 400);
		}
	}

	async getAll () {
		await this.loadFile();
		return this._dataSource;
	}

	async _saveUpdates () {
		let redactData = (JSON.stringify(this._dataSource, null, 4));
		return await writeFileAsync(this._dataSourceFile, redactData);
	}
}

module.exports = fileModel;
