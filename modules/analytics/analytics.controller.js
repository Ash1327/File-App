import * as analyticsService from './analytics.service.js';

const getUsersByOrganization = async (req, res, next) => {
  try {
    const result = await analyticsService.getUsersByOrganization();

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Users by organization analytics retrieved successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const getOrganizationFiles = async (req, res, next) => {
  try {
    const result = await analyticsService.getOrganizationFiles();

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Organization files analytics retrieved successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export { getUsersByOrganization, getOrganizationFiles };
