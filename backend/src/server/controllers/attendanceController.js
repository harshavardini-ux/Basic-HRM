import { Attendance } from '../models/Attendance.js';
import { Employee } from '../models/Employee.js';

export const getAttendance = async (req, res) => {
  try {
    const { 
      date = '', 
      status = '', 
      search = '',
      page = 1,
      limit = 10 
    } = req.query;

    let records = await Attendance.find();

    // 1. Date filter
    if (date) {
      records = records.filter(r => r.date === date);
    }

    // 2. Status filter
    if (status && status !== 'All') {
      records = records.filter(r => r.status === status);
    }

    // 3. Search employee
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      records = records.filter(r => 
        (r.employeeName && r.employeeName.toLowerCase().includes(q)) ||
        (r.employeeId && r.employeeId.toLowerCase().includes(q))
      );
    }

    // Sort descending by date
    records.sort((a, b) => new Date(b.date) - new Date(a.date));

  
    const total = records.length;
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const paginated = records.slice((pageNum - 1) * limitNum, pageNum * limitNum);

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

export const getMyAttendance = async (req, res) => {
  try {
    const employeeId = req.user.employeeId;
    let records = await Attendance.find({ employeeId });
    records.sort((a, b) => new Date(b.date) - new Date(a.date));

    return res.json({
      success: true,
      count: records.length,
      data: records
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const markAttendance = async (req, res) => {
  try {
    const { action = 'clock-in', remarks = '' } = req.body;
    const employeeId = req.user.employeeId || 'EMP101';
    const employeeName = req.user.name;

    const today = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    // Check if an entry already exists for today
    let todayRecord = await Attendance.findOne({ employeeId, date: today });

    if (action === 'clock-in') {
      if (todayRecord) {
        return res.status(400).json({
          success: false,
          message: `You have already clocked in today at ${todayRecord.checkInTime}.`
        });
      }

      // Determine if Late (e.g., after 09:30 AM)
      const currentHour = new Date().getHours();
      const currentMinute = new Date().getMinutes();
      const isLate = (currentHour > 9) || (currentHour === 9 && currentMinute > 30);

      const newRecord = await Attendance.create({
        employeeId,
        employeeName,
        date: today,
        checkInTime: nowTime,
        checkOutTime: '--:--',
        status: isLate ? 'Late' : 'Present',
        remarks: remarks || (isLate ? 'Late check-in recorded' : 'On-time check-in')
      });

      return res.status(201).json({
        success: true,
        message: `Clock-in recorded successfully at ${nowTime}!`,
        data: newRecord
      });
    } else if (action === 'clock-out') {
      if (!todayRecord) {
        return res.status(400).json({
          success: false,
          message: 'Please clock in first before clocking out.'
        });
      }

      const updated = await Attendance.findByIdAndUpdate(todayRecord._id || todayRecord.id, {
        checkOutTime: nowTime,
        remarks: remarks || todayRecord.remarks
      }, { new: true });

      return res.json({
        success: true,
        message: `Clock-out recorded successfully at ${nowTime}!`,
        data: updated
      });
    }

    return res.status(400).json({ success: false, message: 'Invalid attendance action.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;

    const record = await Attendance.findById(id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Attendance record not found.' });
    }

    const updated = await Attendance.findByIdAndUpdate(id, {
      ...(status && { status }),
      ...(remarks !== undefined && { remarks })
    }, { new: true });

    return res.json({
      success: true,
      message: 'Attendance record updated.',
      data: updated
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
