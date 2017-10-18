'use strict';

const jest = require('jest');
const sinon = require('sinon');

const path = require('path');

const TransactionsModel = require('../../../source/models/transactions/transactions');
const Error = require('../../../source/controllers/error');

/////////////////////////////////////////////////////////////////////////////////////

jest.mock('path');
jest.mock('../../../source/controllers/error');


const sandbox = sinon.sandbox.create();
const join = path.join;


const DATA = {
	"id": 0,
	"cardId": 3,
	"type": "card2Card",
	"data": "4701270410000005",
	"time": "2017-10-16T10:52:33+03:00",
	"sum": "16"
};
const TRANSACTIONS = [
	{
		"id": 1,
		"cardId": 1,
		"type": "card2Card",
		"data": "4093560410000024",
		"time": "2017-10-16T10:52:02+03:00",
		"sum": "1"
	},
	{
		"id": 2,
		"cardId": 2,
		"type": "prepaidCard",
		"data": "4701270410000005",
		"time": "2017-10-16T10:52:02+03:00",
		"sum": "1"
	},
	{
		"id": 3,
		"cardId": 3,
		"type": "paymentMobile",
		"data": "+79218908064",
		"time": "2017-10-16T10:52:10+03:00",
		"sum": 25
	}
];


sandbox.stub(TransactionsModel.prototype, 'loadFile').callsFake(function loadFile() {
	this._dataSource = TRANSACTIONS;
});


sandbox.stub(TransactionsModel.prototype, '_saveUpdates').onFirstCall().callsFake(function _saveUpdates() {
	return 'OK';
}).onSecondCall().callsFake(function _saveUpdates() {
	throw 'test error';
});


join.mockImplementation((a,b,c,d) => {
	return d;
});


Error.mockImplementation((err) => {
	return err;
});


//////////////////////////////////////////////////////////////////////////////////////

let transactionsModel;

test('Test constructor', () => {
	transactionsModel = new TransactionsModel();
	expect(transactionsModel._dataSourceFile).toBe('transactions.json');
});


test("Test create",  async() => {
	await transactionsModel.create(DATA);
	DATA.id = 4;
	expect(transactionsModel._dataSource[3]).toEqual(DATA);
});


test("Test create error",  async() => {
	let data;
	try {
		await transactionsModel.create(DATA);
	} catch (err) {
		data = err;
	}
	expect(data).toEqual('Err created transaction: test error');
});
