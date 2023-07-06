const express = require('express');
const router = express.Router();
const dataController = require("./dataController");

router.get('/subjects/:specialization', dataController.getSpecializationsSubjects);
router.post('/progress', dataController.getEffectProgress)
router.post('/correlation', dataController.getSubjectCorrelationMatrix)
router.post('/graph', dataController.getGraphData)
router.get('/subject/:kod', dataController.getSubjectData)
router.post('/subjects-data', dataController.getSubjectsData)

module.exports = router;