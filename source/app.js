const port = 3000;
const Koa = require('koa');
const bodyParser = require('koa-bodyparser')();
const router = require('koa-router')();
const serve = require('koa-static');

const app = new Koa();

const getCardsController = require('./controllers/cards/get-cards');
const createCardsController = require('./controllers/cards/create-card');
const deleteCardsController = require('./controllers/cards/delete-card');

const getTransactionsController = require('./controllers/transactions/get-transactions');
const createTransactionsController = require('./controllers/transactions/create-transactions');

const {renderToString} = require('react-dom/server');

const logger = require('../libs/logger')('app');

//////////////////////////////
const CardsModel = require('./models/cards/cards');
const TransactionsModel = require('./models/transactions/transactions');
const cardsModel = new CardsModel();
const transactionsModel = new TransactionsModel();

///////////////////////////////////////
router.get('/' , async (ctx) => {
	try {
		const indexView = require('../source/views/index.server');
		const DATA = {
			user: {
				login: 'Andrey_Lukin',
				name: 'Андрей Лукин'
			},
			cardsData: await cardsModel.getAll(),
			transactionsData: await transactionsModel.getAll()
		};
		const indexViewHtml = renderToString(indexView(DATA));

		ctx.body = indexViewHtml;
		logger.log('info',ctx.url);
	}
	catch (err) {
		logger.log(`Err in ${ctx.method} ${ctx.url}: `, err);
		ctx.status = 404;
		ctx.message = '404 Bad request';
	}
});



router.get('/error', async() => {throw Error('Oops!');});

router.get('/cards', getCardsController);
router.post('/cards', createCardsController);
router.delete('/cards/:id', deleteCardsController);

router.get('/cards/:id/transactions/', getTransactionsController);
router.post('/cards/:id/transactions/', createTransactionsController);

const pay = require('./controllers/pay');
const transfer = require('./controllers/transfer');

router.post('/cards/:id/pay', pay);
router.post('/cards/:id/transfer',transfer);

app.use(bodyParser);
app.use(router.routes());
app.use(serve('./public'));
if (!module.parent) {
	app.listen(port, () => {
		logger.log('info', `Server RUN: ${port}`)
	});
}

module.exports = app;

/*
// Создадим модель Cards и Transactions на уровне приложения и проинициализируем ее
app.use(async (ctx, next) => {
	ctx.cardsModel = new CardsModel();
	ctx.transactionsModel = new TransactionsModel();

	await Promise.all([
		ctx.cardsModel.loadFile(),
		ctx.transactionsModel.loadFile()
	]);

	await next();
});
*/
