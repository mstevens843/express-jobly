"use strict";

/** Routes for companies. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureLoggedIn, ensureAdmin } = require("../middleware/auth"); // Added ensureAdmin middleware for admin checks
const Company = require("../models/company");

const companyNewSchema = require("../schemas/companyNew.json");
const companyUpdateSchema = require("../schemas/companyUpdate.json");
const companySearchSchema = require("../schemas/companySearch.json"); // Added JSON schema for search validation


const router = new express.Router();

/** POST / { company } =>  { company }
 *
 * company should be { handle, name, description, numEmployees, logoUrl }
 *
 * Returns { handle, name, description, numEmployees, logoUrl }
 *
 * Authorization required: admin
 */

router.post("/", ensureLoggedIn, ensureAdmin, async function (req, res, next) { // Added ensureAdmin middleware
  try {
    const validator = jsonschema.validate(req.body, companyNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const company = await Company.create(req.body);
    return res.status(201).json({ company });
  } catch (err) {
    return next(err);
  }
});

/** GET /  =>
 *   { companies: [ { handle, name, description, numEmployees, logoUrl }, ...] }
 *
 * Can filter on provided search filters:
 * - minEmployees: integer, minimum number of employees a company should have
 * - maxEmployees: integer, maximum number of employees a company should have
 * - nameLike: string, partial case-insensitive match for company name
 *
 * Authorization required: none
 *
 * This route retrieves a list of companies, optionally filtered by the provided
 * query parameters. The query parameters are validated using the JSON schema
 * `companySearchSchema`. The actual filtering logic is implemented in the
 * `Company.findAll()` method in the Company model. If the validation fails, a
 * `BadRequestError` is thrown.
 */

router.get("/", async function (req, res, next) {
  const q = req.query;

  // Convert minEmployees and maxEmployees to integers if they are provided in the query
  if (q.minEmployees !== undefined) q.minEmployees = +q.minEmployees;
  if (q.maxEmployees !== undefined) q.maxEmployees = +q.maxEmployees;

  try {
    // Validate the query parameters using the search schema
    const validator = jsonschema.validate(q, companySearchSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    // Call the Company.findAll method with the query parameters for filtering
    const companies = await Company.findAll(q);
    return res.json({ companies });
  } catch (err) {
    return next(err);
  }
});

/** GET /[handle]  =>  { company }
 *
 *  Company is { handle, name, description, numEmployees, logoUrl, jobs }
 *   where jobs is [{ id, title, salary, equity }, ...]
 *
 * Authorization required: none
 */

router.get("/:handle", async function (req, res, next) {
  try {
    const company = await Company.get(req.params.handle);
    return res.json({ company });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /[handle] { fld1, fld2, ... } => { company }
 *
 * Patches company data.
 *
 * fields can be: { name, description, numEmployees, logoUrl }
 *
 * Returns { handle, name, description, numEmployees, logoUrl }
 *
 * Authorization required: admin
 */

router.patch("/:handle", ensureLoggedIn, ensureAdmin, async function (req, res, next) { // Added ensureAdmin middleware
  try {
    const validator = jsonschema.validate(req.body, companyUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const company = await Company.update(req.params.handle, req.body);
    return res.json({ company });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[handle]  =>  { deleted: handle }
 *
 * Authorization: admin
 */

router.delete("/:handle", ensureLoggedIn, ensureAdmin, async function (req, res, next) { // Added ensureAdmin middleware
  try {
    await Company.remove(req.params.handle);
    return res.json({ deleted: req.params.handle });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
