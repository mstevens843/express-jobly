"use strict";

const { sqlForPartialUpdate } = require("./sql");
const { BadRequestError } = require("../expressError");

describe("sqlForPartialUpdate", function () {
  test("works with valid inputs", function () {
    const result = sqlForPartialUpdate(
      { firstName: "John", age: 30 },
      { firstName: "first_name" }
    );
    expect(result).toEqual({
      setCols: '"first_name"=$1, "age"=$2',
      values: ["John", 30],
    });
  });

  test("works with no jsToSql mappings", function () {
    const result = sqlForPartialUpdate({ firstName: "John", age: 30 }, {});
    expect(result).toEqual({
      setCols: '"firstName"=$1, "age"=$2',
      values: ["John", 30],
    });
  });

  test("throws BadRequestError if no data provided", function () {
    expect(() => sqlForPartialUpdate({}, {})).toThrow(BadRequestError);
  });
});
