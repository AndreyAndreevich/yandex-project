import * as jest from "jest";

const CardsModel = require('../../../source/models/cards/cards');

const DATA = [{'id': 1, 'cardNumber': '0000000000000000', 'balance': 20}];

const path =require('path');
jest.mock('path');
const join = path.join;
join.mockImplementation((a,b,c,d) => {
	return 'test';
});

const fs = require('fs');
jest.mock('fs');
const readFile = fs.readFile;
readFile.mockImplementation((path,callback) => {
	callback(null, JSON.stringify(DATA));
});

const writeFile = fs.writeFile;
writeFile.mockImplementation((path,data,callback) => {
	callback(null, 'OK');
});

jest.mock('../../../source/controllers/error');
const Error = require('../../../source/controllers/error');
Error.mockImplementation((err) => {
	return false;
});

let cardModel;

test('Test constructor', () => {
	cardModel = new CardsModel();
	expect(cardModel._dataSourceFile).toBe('test');
});

test("Test create",  async() => {
	const data = await cardModel.create(DATA);
	expect(data).toEqual(DATA);
});

test("Test delete",  async() => {
	const data = await cardModel.remove(2);
	expect(data).toBe(false);
});
