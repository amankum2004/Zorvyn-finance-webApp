const express = require('express');
const DashboardService = require('../services/dashboardService');
const { authMiddleware, requirePermission } = require('../middleware/auth');
const router = express.Router();

// Apply auth middleware to all dashboard routes
router.use(authMiddleware);
router.use(requirePermission('view_dashboard'));

// Get summary statistics
router.get('/summary', async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    const filters = { start_date, end_date };
    
    // Remove undefined filters
    Object.keys(filters).forEach(key => 
      filters[key] === undefined && delete filters[key]
    );
    
    const summary = await DashboardService.getSummary(req.user, filters);
    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get category totals
router.get('/categories', async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    const filters = { start_date, end_date };
    
    Object.keys(filters).forEach(key => 
      filters[key] === undefined && delete filters[key]
    );
    
    const categories = await DashboardService.getCategoryTotals(req.user, filters);
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get monthly trends
router.get('/trends', async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    const filters = { start_date, end_date };
    
    Object.keys(filters).forEach(key => 
      filters[key] === undefined && delete filters[key]
    );
    
    const trends = await DashboardService.getMonthlyTrends(req.user, filters);
    res.json(trends);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get recent activity
router.get('/recent', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const activities = await DashboardService.getRecentActivity(req.user, parseInt(limit));
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
