import Organization from './organization.model.js';

const createOrganization = async (organizationData) => {
  const { name } = organizationData;

  const organization = new Organization({
    name,
    createdAt: new Date()
  });

  const savedOrganization = await organization.save();
  return savedOrganization;
};

const getOrganizationById = async (organizationId) => {
  const organization = await Organization.findById(organizationId);
  if (!organization) {
    throw new Error('Organization not found');
  }
  return organization;
};

const getAllOrganizations = async () => {
  return await Organization.find();
};

export { createOrganization, getOrganizationById, getAllOrganizations };
