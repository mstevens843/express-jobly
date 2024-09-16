"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Job = require("./job.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("create", function () {
  const newJob = {
    title: "New Job",
    salary: 50000,
    equity: "0.05",
    companyHandle: "c1",
  };

  test("works", async function () {
    let job = await Job.create(newJob);
    expect(job).toEqual({
      id: expect.any(Number),
      title: "New Job",
      salary: 50000,
      equity: "0.05",
      companyHandle: "c1",
    });

    const result = await db.query(
      `SELECT id, title, salary, equity, company_handle AS "companyHandle"
       FROM jobs
       WHERE title = 'New Job'`
    );
    expect(result.rows).toEqual([
      {
        id: expect.any(Number),
        title: "New Job",
        salary: 50000,
        equity: "0.05",
        companyHandle: "c1",
      },
    ]);
  });
});

/************************************** findAll */

describe("findAll", function () {
  test("works: no filter", async function () {
    let jobs = await Job.findAll();
    expect(jobs).toEqual([
      {
        id: expect.any(Number),
        title: "Job1",
        salary: 100000,
        equity: "0.01",
        companyHandle: "c1",
      },
      {
        id: expect.any(Number),
        title: "Job2",
        salary: 200000,
        equity: "0.02",
        companyHandle: "c2",
      },
      {
        id: expect.any(Number),
        title: "Job3",
        salary: 300000,
        equity: "0.03",
        companyHandle: "c3",
      },
    ]);
  });

  test("works: filtering by title", async function () {
    let jobs = await Job.findAll({ title: "Job1" });
    expect(jobs).toEqual([
      {
        id: expect.any(Number),
        title: "Job1",
        salary: 100000,
        equity: "0.01",
        companyHandle: "c1",
      },
    ]);
  });

  test("works: filtering by minSalary", async function () {
    let jobs = await Job.findAll({ minSalary: 200000 });
    expect(jobs).toEqual([
      {
        id: expect.any(Number),
        title: "Job2",
        salary: 200000,
        equity: "0.02",
        companyHandle: "c2",
      },
      {
        id: expect.any(Number),
        title: "Job3",
        salary: 300000,
        equity: "0.03",
        companyHandle: "c3",
      },
    ]);
  });

  test("works: filtering by hasEquity", async function () {
    let jobs = await Job.findAll({ hasEquity: true });
    expect(jobs).toEqual([
      {
        id: expect.any(Number),
        title: "Job1",
        salary: 100000,
        equity: "0.01",
        companyHandle: "c1",
      },
      {
        id: expect.any(Number),
        title: "Job2",
        salary: 200000,
        equity: "0.02",
        companyHandle: "c2",
      },
      {
        id: expect.any(Number),
        title: "Job3",
        salary: 300000,
        equity: "0.03",
        companyHandle: "c3",
      },
    ]);
  });

  test("works: filtering by multiple criteria", async function () {
    let jobs = await Job.findAll({ title: "Job", minSalary: 200000, hasEquity: true });
    expect(jobs).toEqual([
      {
        id: expect.any(Number),
        title: "Job2",
        salary: 200000,
        equity: "0.02",
        companyHandle: "c2",
      },
      {
        id: expect.any(Number),
        title: "Job3",
        salary: 300000,
        equity: "0.03",
        companyHandle: "c3",
      },
    ]);
  });
});

/************************************** get */

describe("get", function () {
  test("works", async function () {
    let job = await Job.get(1);
    expect(job).toEqual({
      id: 1,
      title: "Job1",
      salary: 100000,
      equity: "0.01",
      companyHandle: "c1",
    });
  });

  test("not found if no such job", async function () {
    try {
      await Job.get(999);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** update */

describe("update", function () {
  const updateData = {
    title: "Updated Job",
    salary: 60000,
    equity: "0.1",
  };

  test("works", async function () {
    let job = await Job.update(1, updateData);
    expect(job).toEqual({
      id: 1,
      title: "Updated Job",
      salary: 60000,
      equity: "0.1",
      companyHandle: "c1",
    });

    const result = await db.query(
      `SELECT id, title, salary, equity, company_handle AS "companyHandle"
       FROM jobs
       WHERE id = 1`
    );
    expect(result.rows).toEqual([{
      id: 1,
      title: "Updated Job",
      salary: 60000,
      equity: "0.1",
      companyHandle: "c1",
    }]);
  });

  test("not found if no such job", async function () {
    try {
      await Job.update(999, updateData);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request with no data", async function () {
    try {
      await Job.update(1, {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await Job.remove(1);
    const res = await db.query(
        "SELECT id FROM jobs WHERE id = 1");
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such job", async function () {
    try {
      await Job.remove(999);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
