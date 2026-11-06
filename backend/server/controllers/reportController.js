import { Employee } from '../models/Employee.js';
import { Department } from '../models/Department.js';
import { Attendance } from '../models/Attendance.js';
import { Leave } from '../models/Leave.js';
import { Performance } from '../models/Performance.js';
import { User } from '../models/User.js';

export const getSummaryStats = async (req, res) => {
  try {
    const employees = await Employee.find();
    const departments = await Department.find();
    const attendances = await Attendance.find();
    const leaves = await Leave.find();
    const performances = await Performance.find();
    const users = await User.find();

    const today = new Date().toISOString().split('T')[0];
    const todayAttendance = attendances.filter(a => a.date === today);

    // Employee status metrics
    const totalEmployees = employees.length;
    const activeEmployees = employees.filter(e => e.status === 'Active').length;
    const onLeaveEmployees = employees.filter(e => e.status === 'On Leave').length;
    const resignedEmployees = employees.filter(e => e.status === 'Resigned').length;

    // Today's attendance calculation
    const presentToday = todayAttendance.filter(a => a.status === 'Present').length;
    const lateToday = todayAttendance.filter(a => a.status === 'Late').length;
    const totalAttended = presentToday + lateToday;
    const attendanceRate = totalEmployees > 0 
      ? Math.round((totalAttended / totalEmployees) * 100) 
      : 0;

    // Department breakdown
    const departmentBreakdown = departments.map(dept => {
      const count = employees.filter(e => e.department === dept.name).length;
      return {
        name: dept.name,
        code: dept.code,
        headOfDepartment: dept.headOfDepartment,
        count
      };
    });

    // Leave status breakdown
    const pendingLeaves = leaves.filter(l => l.status === 'Pending').length;
    const approvedLeaves = leaves.filter(l => l.status === 'Approved').length;
    const rejectedLeaves = leaves.filter(l => l.status === 'Rejected').length;

    // Performance ratings
    const totalReviews = performances.length;
    let avgRating = 0;
    if (totalReviews > 0) {
      const sum = performances.reduce((acc, p) => acc + Number(p.rating || 0), 0);
      avgRating = (sum / totalReviews).toFixed(1);
    }

    const ratingDistribution = {
      5: performances.filter(p => Number(p.rating) === 5).length,
      4: performances.filter(p => Number(p.rating) === 4).length,
      3: performances.filter(p => Number(p.rating) === 3).length,
      2: performances.filter(p => Number(p.rating) === 2).length,
      1: performances.filter(p => Number(p.rating) === 1).length
    };

    return res.json({
      success: true,
      data: {
        summary: {
          totalEmployees,
          activeEmployees,
          onLeaveEmployees,
          resignedEmployees,
          totalDepartments: departments.length,
          totalUsers: users.length,
          todayDate: today,
          presentToday,
          lateToday,
          attendanceRate,
          pendingLeaves,
          approvedLeaves,
          rejectedLeaves,
          totalReviews,
          averagePerformanceRating: avgRating
        },
        departmentBreakdown,
        ratingDistribution,
        recentLeaves: leaves.slice(0, 5),
        recentReviews: performances.slice(0, 5)
      }
    });
  } catch (error) {
    console.error('[ReportController] Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
