import * as jest from "jest";

const path =require('path');
const fs = require('fs');

const CardsModel = require('../../../source/models/cards/cards');
const Error = require('../../../source/controllers/error');

/////////////////////////////////////////////////////////////////////////////////////

jest.mock('path');
jest.mock('fs');
jest.mock('../../../source/controllers/error');


const join = path.join;
const readFile = fs.readFile;
const writeFile = fs.writeFile;


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
	readFile.mockImplementation((path,callback) => {
		callback(null, JSON.stringify(CARDS));
	});
	writeFile.mockImplementation((path,data,callback) => {
		callback(null, 'OK');
	});
	let data = {'id': 1, 'cardNumber': '4093560410000024', 'balance': 20};
	data = await cardModel.create(data);
	expect(data).toEqual(DATA);
});



test("Test create error",  async() => {
	readFile.mockImplementation((path,callback) => {
		callback('test error');
	});
	let data = {'id': 1, 'cardNumber': '4093560410000024', 'balance': 20};
	try {
		data = await cardModel.create(data);
	} catch (err) {
		data = err;
	}
	expect(data).toEqual('Err created card: Err loadFile : test error');
});
/*
test("Test remove",  async() => {
	const data = await cardModel.remove(2);
	expect(data).toBe(false);
});
*/
