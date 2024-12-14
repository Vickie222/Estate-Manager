const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['rent', 'sale'], required: true },
  location: {
    address: { type: String, required: true },
    latitude: { type: Number },
    longitude: { type: Number },
  },
  price: { type: Number, required: true },
  amenities: [String],
  images: [String],
  status: { type: String, enum: ['available', 'sold', 'rented'], default: 'available' },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Property', PropertySchema);
