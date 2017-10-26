'use strict';

const jest = require('jest');
const sinon = require('sinon');
const supertest = require('supertest');
const app = require('../../../source/app.js');

const CardsModel = require('../../../source/models/file/cards');
const Error = require('../../../source/controllers/error');

/////////////////////////////////////////////////////////////////////////

jest.mock('../../../source/controllers/error');

const sandbox = sinon.sandbox.create();


const DATA = {cardNumber: '1234567812345779', balance: 1000};
const TRYDATA = {id: 4, cardNumber: '1234567812345779', balance: 1000};
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


sandbox.stub(CardsModel.prototype, 'loadFile').callsFake(function loadFile() {
	this._dataSource = CARDS;
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

test('Test get card controller', async () => {
	const response = await supertest(server)
		.get('/file/');
	expect(response.statusCode).toBe(200);
	expect(response.body).toEqual(CARDS);
});

//////////////////////////////////////////////////////////////////

test('Test create card controller', async () => {
	const response = await supertest(server)
		.post('/file/')
		.set('Accept', 'application/json')
		.send(DATA);
	expect(response.statusCode).toBe(201);
	expect(response.body).toEqual(TRYDATA);
});


test('Test create card controller (error created)', async () => {
	const response = await supertest(server)
		.post('/file/')
		.set('Accept', 'application/json')
		.send(DATA);
	expect(response.statusCode).toBe(400);
	expect(response.text).toBe('400 Bad request');
	sandbox.resetHistory();
});


test('Test create card controller (error number of digits)', async () => {
	const response = await supertest(server)
		.post('/file/')
		.set('Accept', 'application/json')
		.send({cardNumber: '11234567812345678', balance: '1000'});
	expect(response.statusCode).toBe(400);
	expect(response.text).toBe('400 Bad request');
});


test('Test create card controller (error validation Luna)', async () => {
	const response = await supertest(server)
		.post('/file/')
		.set('Accept', 'application/json')
		.send({cardNumber: '1234567812345678', balance: '1000'});
	expect(response.statusCode).toBe(400);
	expect(response.text).toBe('400 Bad request');
});

///////////////////////////////////////////////////////////////////////////////


test('Test delete card controller', async () => {
	const response = await supertest(server)
		.delete('/file/2');
	expect(response.statusCode).toBe(200);
});


test('Test delete card controller (error no card)', async () => {
	const response = await supertest(server)
		.delete('/file/5');
	expect(response.statusCode).toBe(404);
	expect(response.text).toBe('404 Card not found');
});


test('Test delete card controller (error no number id)', async () => {
	const response = await supertest(server)
		.delete('/file/er');
	expect(response.statusCode).toBe(404);
	expect(response.text).toBe('404 Card not found');
});


test('Test delete card controller (error remove)', async () => {
	const response = await supertest(server)
		.delete('/file/1');
	expect(response.statusCode).toBe(404);
	expect(response.text).toBe('404 Card not found');
});

/////////////////////////////////////////////////////////////////

server.close();
