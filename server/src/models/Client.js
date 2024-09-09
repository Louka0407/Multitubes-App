const mongoose = require('mongoose');
const {Schema} = mongoose;

const clientSchema = new Schema({
    client: {
        type: String,
        required: true,
    },
    articleNavision: {
        type: String,
        required: true,
    },
    orderNumber: {
        type: String,
        required: true,
    },
    quantity: {
        type: String,
        required: true,
    },
    rapportId:{
        type: Schema.Types.ObjectId,
        ref: 'Rapport',
        required: true,
    }
});

const Client = mongoose.model('Client', clientSchema);

module.exports = {Client};