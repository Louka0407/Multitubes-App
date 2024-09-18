const mongoose = require('mongoose');

const reportEntrySchema = new mongoose.Schema({
  reportId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rapport',
    required: true,
  },
  timeSlot: {
    type: String,
    enum: ['morning', 'afternoon', 'night','junction'],
    required: true,
  },
  note:{
    type: String,
    default: '',
  },
}, { timestamps: true });

const ReportEntry = mongoose.model('ReportEntry', reportEntrySchema);

module.exports = {ReportEntry};
