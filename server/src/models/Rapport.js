const mongoose = require('mongoose');
const {Schema} = mongoose;

const rapportSchema = new Schema({
    line: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
});

const Rapport = mongoose.model('Rapport', rapportSchema);


module.exports = {Rapport};