'use strict';

const memoryService = require('../services/memory.service');
const { sendSuccess } = require('../utils/apiResponse');

async function list(req, res, next) {
  try { sendSuccess(res, 200, 'Memories retrieved', { memories: await memoryService.list(req.user._id) }); } catch (error) { next(error); }
}

async function create(req, res, next) {
  try { sendSuccess(res, 201, 'Memory created', { memory: await memoryService.create(req.user._id, req.body.content, req.body.category) }); } catch (error) { next(error); }
}

async function remove(req, res, next) {
  try { await memoryService.remove(req.user._id, req.params.id); sendSuccess(res, 200, 'Memory deleted'); } catch (error) { next(error); }
}

async function clear(req, res, next) {
  try { await memoryService.clear(req.user._id); sendSuccess(res, 200, 'Memories cleared'); } catch (error) { next(error); }
}

module.exports = { list, create, remove, clear };