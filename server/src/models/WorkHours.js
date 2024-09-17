const mongoose = require('mongoose');

const workHourEntrySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['A', 'NA', 'OK', 'NOK'],
    required: true,
  }
}, { _id: false });

const workHoursSchema = new mongoose.Schema({
  reportEntryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ReportEntry',
    required: true,
  },
  note: {
    type: String,
    default: '',
  },
  hour: {
    type: String,
    required: true,
  },
  workHours: [workHourEntrySchema],
}, { timestamps: true });

const WorkHours = mongoose.model('WorkHours', workHoursSchema);

module.exports = { WorkHours };
