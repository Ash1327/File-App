import User from '../user/user.model.js';
import File from '../file/file.model.js';

const getUsersByOrganization = async () => {
  const result = await User.aggregate([
    {
      $lookup: {
        from: 'organizations',
        localField: 'organizationId',
        foreignField: '_id',
        as: 'organization'
      }
    },
    {
      $unwind: {
        path: '$organization',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $group: {
        _id: {
          organizationId: '$organizationId',
          organizationName: { $ifNull: ['$organization.name', 'No Organization'] }
        },
        userCount: { $sum: 1 },
        users: {
          $push: {
            userId: '$_id',
            name: '$name',
            email: '$email',
            role: '$role'
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        organizationId: '$_id.organizationId',
        organizationName: '$_id.organizationName',
        userCount: 1,
        users: 1
      }
    },
    {
      $sort: { userCount: -1 }
    }
  ]);

  return result;
};

const getOrganizationFiles = async () => {
  const result = await File.aggregate([
    {
      $lookup: {
        from: 'users',
        localField: 'uploadedBy',
        foreignField: '_id',
        as: 'user'
      }
    },
    {
      $unwind: {
        path: '$user',
        preserveNullAndEmptyArrays: false
      }
    },
    {
      $lookup: {
        from: 'organizations',
        localField: 'user.organizationId',
        foreignField: '_id',
        as: 'organization'
      }
    },
    {
      $unwind: {
        path: '$organization',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $group: {
        _id: {
          organizationId: '$user.organizationId',
          organizationName: { $ifNull: ['$organization.name', 'No Organization'] }
        },
        totalFiles: { $sum: 1 },
        uploadedByUsers: {
          $addToSet: {
            userId: '$uploadedBy',
            userName: '$user.name',
            userEmail: '$user.email'
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        organizationId: '$_id.organizationId',
        organizationName: '$_id.organizationName',
        totalFiles: 1,
        uploadedByUsers: 1
      }
    },
    {
      $sort: { totalFiles: -1 }
    }
  ]);

  return result;
};

export { getUsersByOrganization, getOrganizationFiles };
