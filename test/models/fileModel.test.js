import * as jest from "jest";

const FileModel = require('../../source/models/fileModel');

const DATA = [{'id': 1, 'cardNumber': '0000000000000000', 'balance': 20}];

const path =require('path');
jest.mock('path');
const join = path.join;
join.mockImplementation((a,b,c,d) => {
	return d;
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

jest.mock('../../source/controllers/error');
const Error = require('../../source/controllers/error');
Error.mockImplementation((err) => {
	return false;
});

let fileModel;

test('Test constructor', () => {
	fileModel = new FileModel('test');
	expect(fileModel._dataSourceFile).toBe('test');
});

test("Test loadFile",  async() => {
	await fileModel.loadFile();
	expect(fileModel._dataSource).toEqual(DATA);
});

test("Test getAll",  async() => {
	const data = await fileModel.getAll();
	expect(data).toEqual(DATA);
});

test("Test _saveUpdates",  async() => {
	const data = await fileModel._saveUpdates();
	expect(data).toBe('OK');
});
