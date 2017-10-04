import * as jest from "jest";

const path =require('path');
const fs = require('fs');

const FileModel = require('../../../source/models/fileModel');
const CardsModel = require('../../../source/models/cards/cards');
const Error = require('../../../source/controllers/error');

/////////////////////////////////////////////////////////////////////////////////////

//jest.mock('path');
//jest.mock('fs');
jest.mock('../../../source/models/fileModel');
//jest.mock('../../../source/controllers/error');

const constructor = FileModel.constructor;
const loadFile = FileModel.loadFile;
const getAll = FileModel.getAll;
const _saveUpdates = FileModel._saveUpdates;

/*
const join = path.join;
const readFile = fs.readFile;
const writeFile = fs.writeFile;
*/

const DATA = [{'id': 1, 'cardNumber': '0000000000000000', 'balance': 20}];


loadFile.mockImplementation((sourceFileName) => {
	return 1;
});
/*

join.mockImplementation((a,b,c,d) => {
	return 'test';
});

readFile.mockImplementation((path,callback) => {
	callback(null, JSON.stringify(DATA));
});

writeFile.mockImplementation((path,data,callback) => {
	callback(null, 'OK');
});

Error.mockImplementation((err) => {
	return false;
});
*/

//////////////////////////////////////////////////////////////////////////////////////

let cardModel;
/*
test('Test constructor', () => {
	cardModel = new CardsModel();
	expect(cardModel._dataSourceFile).toBe('test');
});

/*
test("Test create",  async() => {
	const data = await cardModel.create(DATA);
	expect(data).toEqual(DATA);
});

test("Test delete",  async() => {
	const data = await cardModel.remove(2);
	expect(data).toBe(false);
});
*/
