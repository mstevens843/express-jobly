"use strict"; 

// ROUTES FOR JOBS

const jsonschema = require('jsonschema'); 
const express = require('express'); 

const { BadRequestError } = require('../expressError'); 
const { ensureAdmin } = require('../middleware/auth');
const Job = require('../models/job'); 
const jobNewSchema = require('../schemas/jobNew.json'); 
const jobUpdateSchema = require('../schemas/jobUpdate.json');
const jobSearchSchema = require('../schemas/jobSearch.json'); // Added schema for search validation

const router = new express.Router(); 

// POST / { job } => { job }
// job should be {title, salary, equity, companyHandle }
// Returns { id, title, salary, equity, companyHandle }
// Authorization required: admin 

router.post('/', ensureAdmin, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, jobNewSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const job = await Job.create(req.body);
        return res.status(201).json({ job }); 
    } catch(err) {
        return next(err); 
    }
});

// GET / =>
// jobs [{ id, title, salary, equity, companyHandle }, ...]
// Can filter on provided search filters:
// - title: filter by job title (case-insensitive, partial match)
// - minSalary: filter to jobs with at least that salary
// - hasEquity: if true, filter to jobs that provide non-zero equity
// Authorization required: none

router.get('/', async function (req, res, next) {
    const q = req.query;
    
    // Convert minSalary to an integer if it exists
    if (q.minSalary !== undefined) q.minSalary = +q.minSalary;
    
    // Convert hasEquity to a boolean
    if (q.hasEquity !== undefined) q.hasEquity = q.hasEquity === "true";
    
    try {
        // Validate the query parameters using the search schema
        const validator = jsonschema.validate(q, jobSearchSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const jobs = await Job.findAll(q);
        return res.json({ jobs });
    } catch(err) {
        return next(err);
    }
});

// GET /[id] => { job }
// Job is { id, title, salary, equity, companyHandle }
// Authorization: none 
router.get('/:id', async function (req, res, next) {
    try {
        const job = await Job.get(req.params.id);
        return res.json({ job });
    } catch(err) {
        return next(err); 
    }
});

// PATCH /[id] { fld1, fld2, ... } => { job }
// Patches job data. 
// fields can be: {title, salary, equity} 
// Returns { id, title, salary, equity, companyHandle }
// Authorization required: admin
router.patch("/:id", ensureAdmin, async function (req, res, next) {
    try {
      const validator = jsonschema.validate(req.body, jobUpdateSchema);
      if (!validator.valid) {
        const errs = validator.errors.map(e => e.stack);
        throw new BadRequestError(errs);
      }
  
      const job = await Job.update(req.params.id, req.body);
      return res.json({ job });
    } catch (err) {
      return next(err);
    }
});

// DELETE /[id] => { deleted: id } 
// Authorization required: admin
router.delete('/:id', ensureAdmin, async function (req, res, next) {
    try {
        await Job.remove(req.params.id);
        return res.json({ deleted: req.params.id });
    } catch(err) {
        return next(err);
    }
});

module.exports = router; 
