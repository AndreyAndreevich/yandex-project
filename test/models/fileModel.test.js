'use strict';

const jest = require('jest');

const path =require('path');
const fs = require('fs');

const FileModel = require('../../source/models/fileModel');
const Error = require('../../source/controllers/error');

//////////////////////////////////////////////////////////////////////////////////////////

jest.mock('path');
jest.mock('fs');
jest.mock('../../source/controllers/error');


const join = path.join;
const readFile = fs.readFile;
const writeFile = fs.writeFile;


const DATA = [{'id': 1, 'cardNumber': '0000000000000000', 'balance': 20}];


join.mockImplementation((a,b,c,d) => {
	return d;
});


Error.mockImplementation((err) => {
	return err;
});


///////////////////////////////////////////////////////////////////////////////////////

let fileModel;

test('Test constructor', () => {
	fileModel = new FileModel('test');
	expect(fileModel._dataSourceFile).toBe('test');
});



test("Test loadFile",  async() => {
	readFile.mockImplementation((path,callback) => {
		callback(null, JSON.stringify(DATA));
	});
	await fileModel.loadFile();
	expect(fileModel._dataSource).toEqual(DATA);
});



test("Test loadFile error",  async() => {
	readFile.mockImplementation((path,callback) => {
		callback("test error");
	});
	const errFileModel = new FileModel();
	let error = 0;
	try {
		await errFileModel.loadFile();
	} catch (err) {
		error = err;
	}
	expect(error).toBe('Err loadFile : test error');
});



test("Test getAll",  async() => {
	readFile.mockImplementation((path,callback) => {
		callback(null, JSON.stringify(DATA));
	});
	const data = await fileModel.getAll();
	expect(data).toEqual(DATA);
});



test("Test getAll error",  async() => {
	readFile.mockImplementation((path,callback) => {
		callback("test error");
	});
	const errFileModel = new FileModel();
	let data;
	try {
		data = await errFileModel.getAll();
	} catch (err) {
		data = err;
	}
	expect(data).toBe('Err loadFile : test error');
});



test("Test _saveUpdates",  async() => {
	writeFile.mockImplementation((path,data,callback) => {
		callback(null, 'OK');
	});
	const data = await fileModel._saveUpdates();
	expect(data).toBe('OK');
});



test("Test _saveUpdates error",  async() => {
	writeFile.mockImplementation((path,data,callback) => {
		callback('test error');
	});
	let data;
	try {
		data = await fileModel._saveUpdates();
	} catch (err) {
		data = err;
	}
	expect(data).toBe('Err _saveUpdates : test error');
});
