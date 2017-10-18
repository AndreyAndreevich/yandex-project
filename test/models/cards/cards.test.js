'use strict';

const jest = require('jest');
const sinon = require('sinon');

const path = require('path');

const CardsModel = require('../../../source/models/cards/cards');
const Error = require('../../../source/controllers/error');

/////////////////////////////////////////////////////////////////////////////////////

jest.mock('path');
jest.mock('../../../source/controllers/error');


const sandbox = sinon.sandbox.create();
const join = path.join;


const DATA = {'id': 2, 'cardNumber': '4093560410000024', 'balance': 20};
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


join.mockImplementation((a,b,c,d) => {
	return d;
});


Error.mockImplementation((err) => {
	return err;
});


//////////////////////////////////////////////////////////////////////////////////////

let cardModel;

test('Test constructor', () => {
	cardModel = new CardsModel();
	expect(cardModel._dataSourceFile).toBe('cards.json');
});


test("Test create",  async() => {
	let data = {'id': 1, 'cardNumber': '4093560410000024', 'balance': 20};
	data = await cardModel.create(data);
	expect(data).toEqual(DATA);
});



test("Test create error",  async() => {
	let data = {'id': 1, 'cardNumber': '4093560410000024', 'balance': 20};
	try {
		data = await cardModel.create(data);
	} catch (err) {
		data = err;
	}
	sandbox.resetHistory();
	expect(data).toEqual('Err created card: test error');
});


test("Test remove",  async() => {
	await cardModel.remove(2);
	const focus = [ { 'id': 1, 'cardNumber': '4701270410000005', 'balance': 4334 },
		{ 'id': 3, 'cardNumber': '5469250410000042', 'balance': 7850 } ];
	expect(cardModel._dataSource).toEqual(focus);
});


test("Test remove error",  async() => {
	let data;
	try {
		await cardModel.remove(2);
	} catch (err) {
		data = err;
	}
	sandbox.resetHistory();
	expect(data).toEqual('Err deleted : Не существует карты с id 2');
});

