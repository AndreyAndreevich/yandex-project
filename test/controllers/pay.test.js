'use strict';

const jest = require('jest');
const sinon = require('sinon');
const supertest = require('supertest');
const app = require('../../source/app.js');
const moment = require('moment');

const CardsModel = require('../../source/models/cards/cards');
const TransactionsModel = require('../../source/models/transactions/transactions');
const Error = require('../../source/controllers/error');

/////////////////////////////////////////////////////////////////////////

jest.mock('../../source/controllers/error');

const sandbox = sinon.sandbox.create();


const DATA = {
	"type": "paymentMobile",
	"data": "89119348960",
	"sum": 20
};
const TRYDATA = {
	'card': {
		"id": 2,
		"cardNumber": "4093560410000024",
		"balance": 7414
	},
	'transaction': 	{
		"id": 4,
		"cardId": 2,
		"type": "paymentMobile",
		"data": "89119348960",
		"time": "2017-10-16T10:52:02+03:00",
		"sum": 20
	},
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

sandbox.stub(moment.prototype, 'format').callsFake(function format(string) {
	return  '2017-10-16T10:52:02+03:00';
});


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


sandbox.stub(CardsModel.prototype, '_saveUpdates').onFirstCall().callsFake(function _saveUpdates() {
	return 'OK';
}).onSecondCall().callsFake(function _saveUpdates() {
	throw 'test error';
});


Error.mockImplementation((err) => {
	return err;
});

const server = app.listen();


////////////////////////////////////////////////////////////////

test('Test pay', async () => {
	const response = await supertest(server)
		.post('/cards/2/pay')
		.set('Accept', 'application/json')
		.send(DATA);
	expect(response.statusCode).toBe(201);
	expect(response.body).toEqual(TRYDATA);
});


test('Test pay (error id)', async () => {
	const response = await supertest(server)
		.post('/cards/4/pay')
		.set('Accept', 'application/json')
		.send(DATA);
	expect(response.statusCode).toBe(400);
	expect(response.text).toEqual('400 Bad request');
});


test('Test pay (error data)', async () => {
	const response = await supertest(server)
		.post('/cards/2/pay')
		.set('Accept', 'application/json')
		.send({
		"type": "paymentMobile",
		"data": '89119348960'
	});
	expect(response.statusCode).toBe(400);
	expect(response.text).toEqual('400 Bad request');
});


test('Test pay (error sum)', async () => {
	const response = await supertest(server)
		.post('/cards/2/pay')
		.set('Accept', 'application/json')
		.send({
			"type": "paymentMobile",
			"data": '89119348960',
			'sum': '10as',
		});
	expect(response.statusCode).toBe(400);
	expect(response.text).toEqual('400 Bad request');
});


test('Test pay (error balance)', async () => {
	const response = await supertest(server)
		.post('/cards/2/pay')
		.set('Accept', 'application/json')
		.send({
			"type": "paymentMobile",
			"data": '89119348960',
			'sum': 7500,
		});
	expect(response.statusCode).toBe(400);
	expect(response.text).toEqual('400 Bad request');
});


test('Test pay (error created)', async () => {
	const response = await supertest(server)
		.post('/cards/3/pay')
		.set('Accept', 'application/json')
		.send(DATA);
	expect(response.statusCode).toBe(400);
	expect(response.text).toEqual('400 Bad request');
});

/////////////////////////////////////////////////////////////////

server.close();

