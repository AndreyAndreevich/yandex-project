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

const errorController = require('./controllers/error');


router.get('/' , async (ctx) => {
	try {
		ctx.body = `<!doctype html>
	<html>
		<head>
			<link rel="stylesheet" href="/style.css">
		</head>
		<body>
			<h1>Hello Smolny!</h1>
		</body>
	</html>`;
	} catch (err) {
		console.log('Err in / : ', err);
	}
});

router.get('/error', async() => {throw Error('Oops!');});

router.get('/transfer', (req, res) => {
	const {amount, from, to} = req.query;
	res.json({
		result: 'success',
		amount,
		from,
		to
	});
});

router.get('/cards', getCardsController);
router.post('/cards', createCardsController);
router.delete('/cards/:id', deleteCardsController);

router.get('/cards/:id/transactions/', getTransactionsController);
router.post('/cards/:id/transactions/', createTransactionsController);


app.use(bodyParser);
app.use(router.routes());
app.use(serve('./publick'));
app.listen(port, () => {
	console.log(`Server RUN: ${port}`)
});
