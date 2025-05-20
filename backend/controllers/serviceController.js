const asyncHandler = require('express-async-handler');
const Service = require('../models/Service');

// 📌 Créer un service
exports.createService = asyncHandler(async (req, res) => {
  const { title, description, price } = req.body;

  if (!title || !description || !price) {
    return res.status(400).json({ message: 'Tous les champs sont requis' });
  }

  const service = new Service({
    professional: req.user._id,
    title,
    description,
    price,
  });

  const createdService = await service.save();
  res.status(201).json(createdService);
});

// 📌 Mettre à jour un service
exports.updateService = asyncHandler(async (req, res) => {
  const { title, description, price } = req.body;
  const service = await Service.findById(req.params.id);

  if (!service) {
    return res.status(404).json({ message: 'Service non trouvé' });
  }

  if (service.professional.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Accès refusé' });
  }

  service.title = title || service.title;
  service.description = description || service.description;
  service.price = price || service.price;

  const updatedService = await service.save();
  res.json(updatedService);
});

// 📌 Supprimer un service
exports.deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    return res.status(404).json({ message: 'Service non trouvé' });
  }

  if (service.professional.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Accès refusé' });
  }

  await service.remove();
  res.json({ message: 'Service supprimé' });
});

// 📌 Obtenir un service par ID
exports.getServiceById = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id).populate('professional', 'domain location');

  if (!service) {
    return res.status(404).json({ message: 'Service non trouvé' });
  }

  res.json(service);
});

// 📌 Rechercher des services
exports.searchServices = asyncHandler(async (req, res) => {
  const { keyword } = req.query;

  if (!keyword) {
    return res.status(400).json({ message: 'Le mot-clé est requis pour la recherche' });
  }

  const services = await Service.find({
    title: { $regex: keyword, $options: 'i' },
  }).populate('professional', 'domain location');

  res.json(services);
});

// 📌 Obtenir services d’un professionnel spécifique
exports.getServicesByProfessional = asyncHandler(async (req, res) => {
  const services = await Service.find({ professional: req.params.id });

  if (!services || services.length === 0) {
    return res.status(404).json({ message: 'Aucun service trouvé pour ce professionnel' });
  }

  res.json(services);
});

// 📌 Obtenir services du pro connecté
exports.getMyServices = asyncHandler(async (req, res) => {
  const services = await Service.find({ professional: req.user._id });

  if (!services || services.length === 0) {
    return res.status(404).json({ message: 'Aucun service trouvé pour l’utilisateur connecté' });
  }

  res.json(services);
});