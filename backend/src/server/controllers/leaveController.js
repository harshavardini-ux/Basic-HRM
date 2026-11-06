import { Leave } from '../models/Leave.js';
import { Employee } from '../models/Employee.js';

export const getAllLeaves = async (req, res) => {
  try {
    const { status = '', search = '', page = 1, limit = 10 } = req.query;

    let leaves = await Leave.find();

    // 1. Status Filter
    if (status && status !== 'All') {
      leaves = leaves.filter(l => l.status === status);
    }

    // 2. Search by employee name or ID
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      leaves = leaves.filter(l => 
        (l.employeeName && l.employeeName.toLowerCase().includes(q)) ||
        (l.employeeId && l.employeeId.toLowerCase().includes(q)) ||
        (l.reason && l.reason.toLowerCase().includes(q))
      );
    }

    // Sort newest appliedAt first
    leaves.sort((a, b) => new Date(b.createdAt || b.appliedAt) - new Date(a.createdAt || a.appliedAt));

    const total = leaves.length;
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const paginated = leaves.slice((pageNum - 1) * limitNum, pageNum * limitNum);

    return res.json({
      success: true,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      data: paginated
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const getMyLeaves = async (req, res) => {
  try {
    const employeeId = req.user.employeeId;
    let leaves = await Leave.find({ employeeId });
    leaves.sort((a, b) => new Date(b.createdAt || b.appliedAt) - new Date(a.createdAt || a.appliedAt));

    return res.json({
      success: true,
      count: leaves.length,
      data: leaves
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const applyLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, numberOfDays, reason } = req.body;
    const employeeId = req.user.employeeId || 'EMP101';
    const employeeName = req.user.name;

    // Backend Validation
    if (!leaveType || !startDate || !endDate || !numberOfDays || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Please provide Leave Type, Start Date, End Date, Number of Days, and Reason.'
      });
    }

    if (new Date(endDate) < new Date(startDate)) {
      return res.status(400).json({
        success: false,
        message: 'End date cannot be earlier than start date.'
      });
    }

    const newLeave = await Leave.create({
      employeeId,
      employeeName,
      leaveType,
      startDate,
      endDate,
      numberOfDays: Number(numberOfDays),
      reason: reason.trim(),
      status: 'Pending',
      appliedAt: new Date().toISOString().split('T')[0],
      reviewedBy: 'Pending Review',
      comments: ''
    });

    return res.status(201).json({
      success: true,
      message: 'Leave application submitted successfully for HR review.',
      data: newLeave
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, comments = '' } = req.body;

    if (!['Approved', 'Rejected', 'Pending'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be Approved, Rejected, or Pending.'
      });
    }

    const leave = await Leave.findById(id);
    if (!leave) {
      return res.status(404).json({ success: false, message: 'Leave application not found.' });
    }

    const updated = await Leave.findByIdAndUpdate(id, {
      status,
      comments: comments.trim(),
      reviewedBy: req.user.name
    }, { new: true });

    // If approved, update employee status to 'On Leave'
    if (status === 'Approved') {
      const emp = await Employee.findOne({ employeeId: leave.employeeId });
      if (emp) {
        await Employee.findByIdAndUpdate(emp._id || emp.id, { status: 'On Leave' });
      }
    }

    return res.json({
      success: true,
      message: `Leave application marked as ${status}.`,
      data: updated
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
