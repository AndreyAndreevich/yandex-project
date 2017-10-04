import * as jest from "jest";

const TransactionsModel = require('../../../source/models/transactions/transactions');

const DATA = [{
	"id": 1,
	"cardId": 1,
	"type": "card2Card",
	"data": "4093560410000024",
	"time": "2017-10-16T10:52:02+03:00",
	"sum": "100"
}];

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

let transactionsModel;

test('Test constructor', () => {
	transactionsModel = new TransactionsModel();
	expect(transactionsModel._dataSourceFile).toBe('test');
});
