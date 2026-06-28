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
  return success(res, 'Halls fetched successfully', { halls, total: halls.length });
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
