const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Transaction = mongoose.model('Transaction', {
	id: {
		type: Number,
		required: true
	},
	cardId: Number,
	type: String,
	data: Schema.Types.Mixed,
	time: {
		type: Date,
		default: Date.now
	},
	sum: Number
});

module.exports = Transaction;
