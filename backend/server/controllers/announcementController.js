// ============================================================================
// Announcement Controller
// Handles campus/company wide notice board bulletins
// ============================================================================

import { Announcement } from '../models/Announcement.js';

// @desc    Get all announcements
// @route   GET /api/announcements
// @access  Private
export const getAnnouncements = async (req, res) => {
  try {
    let announcements = await Announcement.find();
    announcements.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));

    return res.json({
      success: true,
      count: announcements.length,
      data: announcements
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create announcement
// @route   POST /api/announcements
// @access  Private (Admin, HR Manager)
export const createAnnouncement = async (req, res) => {
  try {
    const { title, content, priority = 'Normal' } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both title and announcement content.'
      });
    }

    const created = await Announcement.create({
      title: title.trim(),
      content: content.trim(),
      priority,
      author: req.user.name,
      date: new Date().toISOString().split('T')[0]
    });

    return res.status(201).json({
      success: true,
      message: 'Announcement published successfully.',
      data: created
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete announcement
// @route   DELETE /api/announcements/:id
// @access  Private (Admin, HR Manager)
export const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    await Announcement.findByIdAndDelete(id);

    return res.json({
      success: true,
      message: 'Announcement deleted.'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
