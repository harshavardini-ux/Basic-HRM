import { Employee } from '../models/Employee.js';
import { Department } from '../models/Department.js';

export const getAllEmployees = async (req, res) => {
  try {
    const { 
      search = '', 
      department = '', 
      status = '', 
      sortBy = 'createdAt', 
      order = 'desc',
      page = 1,
      limit = 10
    } = req.query;

    let employees = await Employee.find();

    // 1. Search by name, employeeId, or email
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      employees = employees.filter(emp => 
        (emp.fullName && emp.fullName.toLowerCase().includes(q)) ||
        (emp.employeeId && emp.employeeId.toLowerCase().includes(q)) ||
        (emp.email && emp.email.toLowerCase().includes(q)) ||
        (emp.designation && emp.designation.toLowerCase().includes(q))
      );
    }

    // 2. Filter by Department
    if (department && department !== 'All') {
      employees = employees.filter(emp => emp.department === department);
    }

    // 3. Filter by Status
    if (status && status !== 'All') {
      employees = employees.filter(emp => emp.status === status);
    }

    // 4. Sorting
    employees.sort((a, b) => {
      let valA = a[sortBy] ?? '';
      let valB = b[sortBy] ?? '';
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return order === 'asc' ? -1 : 1;
      if (valA > valB) return order === 'asc' ? 1 : -1;
      return 0;
    });

    // 5. Pagination
    const totalRecords = employees.length;
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedRecords = employees.slice(startIndex, startIndex + limitNum);

    return res.json({
      success: true,
      count: paginatedRecords.length,
      total: totalRecords,
      totalPages: Math.ceil(totalRecords / limitNum) || 1,
      currentPage: pageNum,
      data: paginatedRecords
    });
  } catch (error) {
    console.error('[EmployeeController.getAllEmployees] Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee record not found.' });
    }
    return res.json({ success: true, data: employee });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createEmployee = async (req, res) => {
  try {
    const {
      employeeId,
      fullName,
      email,
      phone,
      department,
      designation,
      joiningDate,
      salary,
      status = 'Active',
      address = '',
      emergencyContact = ''
    } = req.body;

    // Backend Form Validation (Step required by Guidelines!)
    if (!employeeId || !fullName || !email || !phone || !department || !designation || !joiningDate || salary === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error: Please fill in all required fields (Employee ID, Full Name, Email, Phone, Department, Designation, Joining Date, Salary).'
      });
    }

    // Check duplicate employeeId or email
    const existingEmp = await Employee.findOne({ employeeId: employeeId.trim().toUpperCase() });
    if (existingEmp) {
      return res.status(400).json({
        success: false,
        message: `Employee ID ${employeeId} is already in use.`
      });
    }

    const existingEmail = await Employee.findOne({ email: email.toLowerCase().trim() });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: `Email address ${email} is already registered.`
      });
    }

    const newEmployee = await Employee.create({
      employeeId: employeeId.trim().toUpperCase(),
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      department,
      designation: designation.trim(),
      joiningDate,
      salary: Number(salary),
      status,
      address: address.trim(),
      emergencyContact: emergencyContact.trim()
    });

    // Update department count
    const dept = await Department.findOne({ name: department });
    if (dept) {
      await Department.findByIdAndUpdate(dept._id || dept.id, {
        totalEmployees: (dept.totalEmployees || 0) + 1
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Employee record created successfully.',
      data: newEmployee
    });
  } catch (error) {
    console.error('[EmployeeController.createEmployee] Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update employee profile
// @route   PUT /api/employees/:id
// @access  Private (Admin, HR Manager)
export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found.' });
    }

    const updated = await Employee.findByIdAndUpdate(id, req.body, { new: true });

    return res.json({
      success: true,
      message: 'Employee details updated successfully.',
      data: updated
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found.' });
    }

    await Employee.findByIdAndDelete(id);

    return res.json({
      success: true,
      message: `Employee ${employee.fullName} (${employee.employeeId}) removed successfully.`
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
