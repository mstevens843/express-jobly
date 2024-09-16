"use strict";

const { BadRequestError } = require("../expressError");

/**
 * Generate SQL for a partial update.
 * 
 * The function creates a SQL `SET` clause for updating specific columns in a table,
 * with appropriate SQL column names and positional parameters.
 * 
 * Example:
 *    sqlForPartialUpdate(
 *      { firstName: 'John', age: 30 },
 *      { firstName: 'first_name' }
 *    )
 * 
 * Returns:
 *    {
 *      setCols: '"first_name"=$1, "age"=$2',
 *      values: ['John', 30]
 *    }
 * 
 * @param {Object} dataToUpdate - An object containing the data to update.
 * @param {Object} jsToSql - An object mapping JavaScript-style keys to SQL-style column names.
 * 
 * @throws {BadRequestError} If no data is provided for the update.
 * 
 * @returns {Object} An object with two properties:
 *                   - setCols: A string containing the SQL `SET` clause.
 *                   - values: An array of values corresponding to the positional parameters.
 */
function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
