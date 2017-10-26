'use strict';

const jest = require('jest');
const sinon = require('sinon');
const supertest = require('supertest');
const app = require('../../../source/app.js');

const CardsModel = require('../../../source/models/file/cards');
const TransactionsModel = require('../../../source/models/file/transactions');
const Error = require('../../../source/controllers/error');

/////////////////////////////////////////////////////////////////////////

jest.mock('../../../source/controllers/error');

const sandbox = sinon.sandbox.create();


const DATA = {
	"id": 0,
	"cardId": 3,
	"type": "card2Card",
	"data": "4701270410000005",
	"time": "2017-10-16T10:52:33+03:00",
	"sum": 16
};
const TRYDATA = {
	"id": 4,
	"cardId": 3,
	"type": "card2Card",
	"data": "4701270410000005",
	"time": "2017-10-16T10:52:33+03:00",
	"sum": "16"
};
const CARDS = [
	{
		"id": 1,
		"cardNumber": "4701270410000005",
		"balance": 4334
	},
	{
		"id": 2,
		"cardNumber": "4093560410000024",
		"balance": 7434
	},
	{
		"id": 3,
		"cardNumber": "5469250410000042",
		"balance": 7850
	}
];
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


sandbox.stub(CardsModel.prototype, 'loadFile').callsFake(function loadFile() {
	this._dataSource = CARDS;
});


sandbox.stub(TransactionsModel.prototype, '_saveUpdates').onFirstCall().callsFake(function _saveUpdates() {
	return 'OK';
}).onSecondCall().callsFake(function _saveUpdates() {
	throw 'test error';
});


Error.mockImplementation((err) => {
	return err;
});

const server = app.listen();


////////////////////////////////////////////////////////////////

test('Test get transaction controller', async () => {
	const response = await supertest(server)
		.get('/file/1/transactions');
	expect(response.statusCode).toBe(200);
	expect(response.body).toEqual([{
		"id": 1,
		"cardId": 1,
		"type": "card2Card",
		"data": "4093560410000024",
		"time": "2017-10-16T10:52:02+03:00",
		"sum": "1"
	}]);
});


test('Test get transaction controller (error id)', async () => {
	const response = await supertest(server)
		.get('/file/ee/transactions');
	expect(response.statusCode).toBe(400);
	expect(response.text).toBe('400 Bad request');
});

//////////////////////////////////////////////////////////////////

test('Test create transaction controller', async () => {
	const response = await supertest(server)
		.post('/file/1/transactions')
		.set('Accept', 'application/json')
		.send(DATA);
	expect(response.statusCode).toBe(200);
});


test('Test create transaction controller (error id)', async () => {
	const response = await supertest(server)
		.post('/file/4/transactions')
		.set('Accept', 'application/json')
		.send(DATA);
	expect(response.statusCode).toBe(400);
	expect(response.text).toBe('400 Bad request');
});


test('Test create transaction controller (error created)', async () => {
	const response = await supertest(server)
		.post('/file/1/transactions')
		.set('Accept', 'application/json')
		.send(DATA);
	expect(response.statusCode).toBe(400);
	expect(response.text).toBe('400 Bad request');
});


test('Test create transaction controller (error data.type)', async () => {
	DATA.type = "error";
	const response = await supertest(server)
		.post('/file/1/transactions')
		.set('Accept', 'application/json')
		.send(DATA);
	expect(response.statusCode).toBe(400);
	expect(response.text).toBe('400 Bad request');
});

/////////////////////////////////////////////////////////////////

server.close();
