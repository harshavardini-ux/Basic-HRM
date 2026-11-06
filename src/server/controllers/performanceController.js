// ============================================================================
// Performance Controller
// Handles employee performance appraisals, rating reviews, and evaluations
// ============================================================================

import { Performance } from '../models/Performance.js';
import { Employee } from '../models/Employee.js';

// @desc    Get all performance reviews
// @route   GET /api/performance
// @access  Private (Admin, HR Manager)
export const getAllReviews = async (req, res) => {
  try {
    const { rating = '', search = '', period = '' } = req.query;

    let reviews = await Performance.find();

    // 1. Filter by rating
    if (rating && rating !== 'All') {
      reviews = reviews.filter(r => Number(r.rating) === Number(rating));
    }

    // 2. Filter by period
    if (period && period !== 'All') {
      reviews = reviews.filter(r => r.reviewPeriod === period);
    }

    // 3. Search by employee name or ID
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      reviews = reviews.filter(r => 
        (r.employeeName && r.employeeName.toLowerCase().includes(q)) ||
        (r.employeeId && r.employeeId.toLowerCase().includes(q)) ||
        (r.reviewerName && r.reviewerName.toLowerCase().includes(q))
      );
    }

    reviews.sort((a, b) => new Date(b.createdAt || b.reviewDate) - new Date(a.createdAt || a.reviewDate));

    return res.json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user's performance evaluations
// @route   GET /api/performance/my
// @access  Private (Employee)
export const getMyReviews = async (req, res) => {
  try {
    const employeeId = req.user.employeeId;
    let reviews = await Performance.find({ employeeId });
    reviews.sort((a, b) => new Date(b.createdAt || b.reviewDate) - new Date(a.createdAt || a.reviewDate));

    return res.json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add a performance appraisal review
// @route   POST /api/performance
// @access  Private (Admin, HR Manager)
export const createReview = async (req, res) => {
  try {
    const {
      employeeId,
      reviewPeriod,
      rating,
      keyAchievements,
      areasOfImprovement = '',
      feedback = ''
    } = req.body;

    // Validation
    if (!employeeId || !reviewPeriod || !rating || !keyAchievements) {
      return res.status(400).json({
        success: false,
        message: 'Please provide Employee ID, Review Period, Rating (1-5), and Key Achievements.'
      });
    }

    const emp = await Employee.findOne({ employeeId });
    const employeeName = emp ? emp.fullName : 'Employee ' + employeeId;

    const newReview = await Performance.create({
      employeeId,
      employeeName,
      reviewPeriod,
      rating: Number(rating),
      keyAchievements: keyAchievements.trim(),
      areasOfImprovement: areasOfImprovement.trim(),
      reviewerName: req.user.name,
      feedback: feedback.trim(),
      reviewDate: new Date().toISOString().split('T')[0]
    });

    return res.status(201).json({
      success: true,
      message: 'Performance review recorded successfully.',
      data: newReview
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update performance review
// @route   PUT /api/performance/:id
// @access  Private (Admin, HR Manager)
export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Performance.findById(id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review record not found.' });
    }

    const updated = await Performance.findByIdAndUpdate(id, req.body, { new: true });
    return res.json({
      success: true,
      message: 'Performance review updated successfully.',
      data: updated
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete performance review
// @route   DELETE /api/performance/:id
// @access  Private (Admin only)
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Performance.findById(id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review record not found.' });
    }

    await Performance.findByIdAndDelete(id);
    return res.json({
      success: true,
      message: 'Performance review deleted.'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
