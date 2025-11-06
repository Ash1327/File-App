import * as organizationService from './organization.service.js';

const createOrganization = async (req, res, next) => {
  try {
    const organizationData = req.body;
    const organization = await organizationService.createOrganization(organizationData);

    res.status(201).json({
      success: true,
      status: 201,
      message: 'Organization created successfully',
      data: organization
    });
  } catch (error) {
    next(error);
  }
};

export { createOrganization };
