import { Department } from '../models/Department.js';
import { Employee } from '../models/Employee.js';


export const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    const employees = await Employee.find();

    // Dynamically calculate actual headcount per department
    const enrichedDepartments = departments.map(dept => {
      const count = employees.filter(emp => emp.department === dept.name).length;
      return {
        ...dept,
        totalEmployees: count
      };
    });

    return res.json({
      success: true,
      count: enrichedDepartments.length,
      data: enrichedDepartments
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const createDepartment = async (req, res) => {
  try {
    const { name, code, headOfDepartment = '', description = '' } = req.body;

    // Validation
    if (!name || !code) {
      return res.status(400).json({
        success: false,
        message: 'Department Name and Department Code are required.'
      });
    }

    const existing = await Department.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Department '${name}' already exists.`
      });
    }

    const newDept = await Department.create({
      name: name.trim(),
      code: code.trim().toUpperCase(),
      headOfDepartment: headOfDepartment.trim() || 'Unassigned',
      description: description.trim(),
      totalEmployees: 0
    });

    return res.status(201).json({
      success: true,
      message: 'Department created successfully.',
      data: newDept
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const dept = await Department.findById(id);
    if (!dept) {
      return res.status(404).json({ success: false, message: 'Department not found.' });
    }

    const updated = await Department.findByIdAndUpdate(id, req.body, { new: true });
    return res.json({
      success: true,
      message: 'Department updated successfully.',
      data: updated
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const dept = await Department.findById(id);
    if (!dept) {
      return res.status(404).json({ success: false, message: 'Department not found.' });
    }

    await Department.findByIdAndDelete(id);
    return res.json({
      success: true,
      message: `Department '${dept.name}' deleted successfully.`
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
