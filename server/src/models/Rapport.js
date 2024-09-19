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
rapportSchema.index({ line: 1, date: 1 }, { unique: true });

const Rapport = mongoose.model('Rapport', rapportSchema);


module.exports = {Rapport};