const Joi = require('joi')
const { validation } = require('../../utils/constants')

const findByUsername = {
  params: {
    username: validation.username
  }
}

/**
 *  validate for partial lookup
 *  used by: [q-editor @mention]
 *  @author: Daniel Thompson-Yvetot
 */
const getUsersByPartial = {
  params: {
    partial: validation.username,
    count: Joi.number().min(1).max(100).required()
  }
}

const isUsernameAvailable = {
  params: {
    username: validation.username
  }
}

/**
 * Create a utopian user
 * Used by the auth package
 * @author Icaro Harry
 */
const saveUser = {
  payload: {
    username: validation.username,
    avatarUrl: Joi.string().trim()
  }
}

/**
 * Create a user's work experience
 *
 * @author East Mael
 */
const createWorkExperience = {
  payload: {
    jobTitle: Joi.string().trim().required(),
    company: Joi.string().trim().optional().allow(''),
    location: Joi.string().trim().optional().allow(''),
    fromMonth: Joi.number().integer().min(1).max(12),
    fromYear: Joi.number().integer().min(1900).max(9999),
    toMonth: Joi.number().integer().min(1).max(12),
    toYear: Joi.number().integer().min(1900).max(9999),
    current: Joi.boolean(),
    description: Joi.string().trim().optional().allow('')
  }
}

/**
 * Update a user's work experience
 *
 * @author East Mael
 */
const updateWorkExperience = {
  payload: {
    jobTitle: Joi.string().trim().required(),
    company: Joi.string().trim().optional().allow(''),
    location: Joi.string().trim().optional().allow(''),
    fromMonth: Joi.number().integer().min(1).max(12),
    fromYear: Joi.number().integer().min(1900).max(9999),
    toMonth: Joi.number().integer().min(1).max(12),
    toYear: Joi.number().integer().min(1900).max(9999),
    current: Joi.boolean(),
    description: Joi.string().trim().optional().allow('')
  }
}

const updateProfileMainInformation = {
  payload: {
    email: Joi.string().trim().optional().email().allow(''),
    location: Joi.string().trim().optional().allow(''),
    name: Joi.string().trim().optional().allow('')
  }
}

const updateProfileJob = {
  payload: {
    availableForHire: Joi.boolean(),
    job: Joi.string().trim().optional().allow(''),
    resume: Joi.string().trim().optional().allow('')
  }
}

const updateProfileImages = {
  payload: {
    avatarUrl: Joi.string().trim().required().uri(),
    cover: Joi.string().trim().allow(null).optional().uri()
  }
}

module.exports = {
  saveUser,
  getUsersByPartial,
  getUserByUsername: findByUsername,
  updateProfileMainInformation,
  updateProfileJob,
  updateProfileImages,
  isUsernameAvailable
}
