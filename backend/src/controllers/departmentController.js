import { Department } from '../models/Department.js';

// @desc    Get all hospital departments with capacity & wait times
// @route   GET /api/departments
export const getDepartments = async (req, res, next) => {
  try {
    const departments = await Department.find().sort({ code: 1 });
    res.json({ success: true, count: departments.length, data: departments });
  } catch (error) {
    next(error);
  }
};

// @desc    Update department occupancy & wait time
// @route   PUT /api/departments/:id
export const updateDepartment = async (req, res, next) => {
  try {
    const { occupied, capacity, waitTime, status } = req.body;
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      { occupied, capacity, waitTime, status },
      { new: true, runValidators: true }
    );
    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }
    res.json({ success: true, data: department });
  } catch (error) {
    next(error);
  }
};
