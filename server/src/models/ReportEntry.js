const mongoose = require('mongoose');

const reportEntrySchema = new mongoose.Schema({
  reportId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Report',
    required: true,
  },
  timeSlot: {
    type: String,
    enum: ['Matin', 'Après-midi', 'Soir'],
    required: true,
  },
  workHours: [
    {
      hour: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      }
    }
  ]
}, { timestamps: true });

const ReportEntry = mongoose.model('ReportEntry', reportEntrySchema);

module.exports = ReportEntry;
