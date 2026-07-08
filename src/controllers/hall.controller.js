const hallService = require('../services/hall.service');
const { success } = require('../utils/apiResponse');
const asyncHandler = require('../middlewares/asyncHandler');
const logger = require('../config/logger');

const createHall = asyncHandler(async (req, res) => {
  const hall = await hallService.createHall(req.body);
  logger.info(`[Admin] Hall created: "${hall.name}" (${hall._id})`);
  return success(res, 'Hall created successfully', { hall }, 201);
});

const getAllHalls = asyncHandler(async (req, res) => {
  const halls = await hallService.getAllHalls();

  const screenTypeDetails = {
    standard: {
      key: 'standard',
      displayName: 'Standard',
      icon: '🎬',
      description:
        'Enjoy a classic cinema experience with a standard-sized screen, immersive surround sound, and comfortable seating. Perfect for everyday movie watching at the most affordable price.',
    },
    vip: {
      key: 'vip',
      displayName: 'VIP',
      icon: '👑',
      description:
        'Experience premium comfort with spacious reclining leather seats, extra legroom, and an exclusive atmosphere. Selected locations may also offer in-seat food and beverage service for a luxurious movie experience.',
    },
    imax: {
      key: 'imax',
      displayName: 'IMAX',
      icon: '🎥',
      description:
        'Immerse yourself in breathtaking visuals with a giant screen, crystal-clear image quality, and powerful IMAX surround sound. Ideal for action-packed blockbusters and films designed for the ultimate cinematic experience.',
    },
  };

  const formattedHalls = halls.map((h) => {
    const hall = h.toJSON ? h.toJSON() : h;
    const stKey = hall.screenType ? hall.screenType.toLowerCase() : 'standard';
    return {
      id: hall.id || hall._id,
      displayName: hall.name,
      screenType: screenTypeDetails[stKey] || screenTypeDetails.standard,
      totalRows: hall.totalRows,
      totalColumns: hall.totalColumns,
      totalSeats: hall.totalSeats,
      isActive: hall.isActive,
    };
  });

  return success(res, 'Halls fetched successfully', {
    total: formattedHalls.length,
    halls: formattedHalls,
  });
});

const getHallById = asyncHandler(async (req, res) => {
  const hall = await hallService.getHallById(req.params.id);
  return success(res, 'Hall fetched successfully', { hall });
});

const updateHall = asyncHandler(async (req, res) => {
  const hall = await hallService.updateHall(req.params.id, req.body);
  logger.info(`[Admin] Hall updated: "${hall.name}" (${hall._id})`);
  return success(res, 'Hall updated successfully', { hall });
});

const deleteHall = asyncHandler(async (req, res) => {
  await hallService.deleteHall(req.params.id);
  logger.info(`[Admin] Hall soft-deleted: ${req.params.id}`);
  return success(res, 'Hall deleted successfully', {});
});

const getHallSeats = asyncHandler(async (req, res) => {
  const { hall, seats } = await hallService.getHallWithSeats(req.params.id);
  return success(res, 'Hall seats fetched successfully', {
    hall,
    seats,
    total: seats.length,
  });
});

module.exports = {
  createHall,
  getAllHalls,
  getHallById,
  updateHall,
  deleteHall,
  getHallSeats,
};
