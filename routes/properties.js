const express = require('express');
const Property = require('../models/Property');
const auth = require('../middlewares/auth');
const router = express.Router();

// Create Property
router.post('/', auth('Agent'), async (req, res) => {
  const { title, description, type, location, price, amenities, images } = req.body;
  try {
    const property = new Property({
      title,
      description,
      type,
      location,
      price,
      amenities,
      images,
      uploadedBy: req.user.id,
    });
    await property.save();
    res.status(201).json({ property });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get All Properties
router.get('/', async (req, res) => {
  const properties = await Property.find().populate('uploadedBy', 'name email');
  res.json(properties);
});
router.post('/:id/action', auth('Buyer'), async (req, res) => {
const { id } = req.params;
const { action } = req.body;
const userId = req.user.id;
try {
  const property = await Property.findById(id);
  if(!property){
    return res.status(400).json({message: 'Property not found'});
  }
  if (property.status !='available') {
    return res.status(400).json({message: `Property is already ${property.status}`});
  }
  if (action === 'rent'){
property.status = 'rented';
property.tenant = userId;

  }
  else if (action === 'buy'){
    property.status = 'sold';
property.owner = userId;
  }
  else {
    return res.status(400).json({message: 'invalid action. Use "rent" or "buy".'});
  }
  await property.save();
  res.status(200).json({messag : `Property successfully $ {action === 'rent' ? 'rented' : 'bought'}!`,property});

  }
catch (err){
  res.status(500).json({ message: 'An error occurred.'});
}
});
const checkOwnership = async (req, res, next) => {
    const propertyId = req.params.propertyId;
    const userId = req.user.id; 

    try {
        const property = await Property.findById(propertyId);

        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        if (property.uploadedBy.toString() !== userId) {
            return res.status(403).json({ message: 'You are not authorized to delete this property' });
        }

        req.property = property; // Pass the property to the next middleware
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// DELETE property route
router.delete('/:propertyId', auth('Agent'), checkOwnership, async (req, res) => {
    try {
        await req.property.deleteOne(); // Delete the property
        res.status(200).json({ message: 'Property deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
module.exports = router;
