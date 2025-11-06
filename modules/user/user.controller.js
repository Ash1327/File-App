import * as userService from './user.service.js';

const createUser = async (req, res, next) => {
  try {
    const userData = req.body;
    const user = await userService.createUser(userData);

    res.status(201).json({
      success: true,
      status: 201,
      message: 'User created successfully',
      data: user
    });
  } catch (error) {
    if (error.message === 'Organization not found') {
      return res.status(404).json({ 
        success: false,
        status: 404,
        message: error.message
      });
    }
    if (error.message === 'Email already exists') {
      return res.status(409).json({ 
        success: false,
        status: 409,
        message: error.message
      });
    }
    next(error);
  }
};

export { createUser };
