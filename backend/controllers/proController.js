const Professional = require('../models/Professional');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const cloudinary = require('../utils/cloudinary'); // si vous utilisez Cloudinary
const multer = require('multer');
const sharp = require('sharp');

// 📌 Mettre à jour le profil professionnel
exports.updateProfessionalProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const updates = {
    companyName: req.body.companyName,
    specialization: req.body.specialization,
    description: req.body.description,
    location: req.body.location,
    phone: req.body.phone,
    website: req.body.website,
  };

  const updatedProfessional = await Professional.findOneAndUpdate(
    { user: userId },
    { $set: updates },
    { new: true, upsert: true }
  );

  res.status(200).json({ success: true, data: updatedProfessional });
});

// 📌 Télécharger des photos de réalisations
exports.uploadWorkPhotos = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const files = req.files;

  if (!files || files.length === 0) {
    return res.status(400).json({ message: 'Aucune image téléchargée.' });
  }

  const professional = await Professional.findOne({ user: userId });
  if (!professional) {
    return res.status(404).json({ message: 'Profil professionnel non trouvé.' });
  }

  const imageUrls = [];

  for (const file of files) {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: `works/${userId}`,
    });
    imageUrls.push(result.secure_url);
  }

  professional.portfolioPhotos.push(...imageUrls);
  await professional.save();

  res.status(200).json({ success: true, images: imageUrls });
});

// 📌 Supprimer une photo de réalisation
exports.deleteWorkPhoto = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { imageUrl } = req.body;

  const professional = await Professional.findOne({ user: userId });
  if (!professional) {
    return res.status(404).json({ message: 'Profil non trouvé.' });
  }

  professional.portfolioPhotos = professional.portfolioPhotos.filter(
    (photo) => photo !== imageUrl
  );
  await professional.save();

  res.status(200).json({ success: true, message: 'Image supprimée.' });
});

// 📌 Recherche de professionnels par spécialisation, ville, etc.
exports.searchProfessionals = asyncHandler(async (req, res) => {
  const { specialization, location, keyword } = req.query;

  let filters = {};

  if (specialization) {
    filters.specialization = { $regex: specialization, $options: 'i' };
  }

  if (location) {
    filters.location = { $regex: location, $options: 'i' };
  }

  if (keyword) {
    filters.$or = [
      { companyName: { $regex: keyword, $options: 'i' } },
      { description: { $regex: keyword, $options: 'i' } },
    ];
  }

  const professionals = await Professional.find(filters).populate('user', 'name email');

  res.status(200).json({ success: true, data: professionals });
});
