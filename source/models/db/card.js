const mongoose = require('mongoose');
const Card = mongoose.model('Card', {
	id: {
		type: Number,
		required: true
	},
	cardNumber: {
		type: String,
		validate: {
			validator(value) {
				return luna(value);
			},
			message: '{VALUE} is not a valid card number!'
		},
		required: [true, 'Card number required']
	},
	balance: {
		type: Number,
		required: true
	}
});

module.exports = Card;


const luna = (number) => {
	let sum = 0;
	for (let i = 0; i < number.length; i++) {
		let p = (i % 2) ? number[i]*2 : number[i];
		p = (p>9) ? p - 9 : p;
		sum += Number(p);
	}
	let flag = (sum % 10);
	if (flag) throw(`Ошибка валидации Luna: ${flag}`);
};
