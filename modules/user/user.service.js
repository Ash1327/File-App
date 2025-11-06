import User from './user.model.js';
import Organization from '../organization/organization.model.js';

const createUser = async (userData) => {
  const { name, email, organizationId, role } = userData;

  // Validate organizationId if provided
  if (organizationId) {
    const organization = await Organization.findById(organizationId);
    if (!organization) {
      throw new Error('Organization not found');
    }
  }

  // Check if email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('Email already exists');
  }

  const user = new User({
    name,
    email,
    organizationId: organizationId || null,
    role
  });

  const savedUser = await user.save();
  await savedUser.populate('organizationId');

  return savedUser;
};

const getUserById = async (userId) => {
  const user = await User.findById(userId).populate('organizationId');
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

const getUserByEmail = async (email) => {
  return await User.findOne({ email });
};

export { createUser, getUserById, getUserByEmail };
