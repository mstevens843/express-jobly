const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const db = require("../db.js");
const { BCRYPT_WORK_FACTOR, SECRET_KEY } = require("../config");

let testUserToken;
let testAdminToken;

async function commonBeforeAll() {
  // Clean out all tables
  await db.query("DELETE FROM applications");
  await db.query("DELETE FROM jobs");
  await db.query("DELETE FROM companies");
  await db.query("DELETE FROM users");

  // Insert companies
  await db.query(`
    INSERT INTO companies(handle, name, num_employees, description, logo_url)
    VALUES ('c1', 'C1', 1, 'Desc1', 'http://c1.img'),
           ('c2', 'C2', 2, 'Desc2', 'http://c2.img'),
           ('c3', 'C3', 3, 'Desc3', 'http://c3.img')`);

  // Insert jobs associated with company 'c1'
  await db.query(`
    INSERT INTO jobs (title, salary, equity, company_handle)
    VALUES ('Job1', 100000, 0.01, 'c1'),
           ('Job2', 200000, 0.02, 'c1')`);

  // Insert test users
  const userRes = await db.query(`
        INSERT INTO users(username,
                          password,
                          first_name,
                          last_name,
                          email,
                          is_admin)
        VALUES ('u1', $1, 'U1F', 'U1L', 'u1@email.com', false),
               ('u2', $2, 'U2F', 'U2L', 'u2@email.com', true)
        RETURNING username`,
      [
        await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
        await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
      ]);

  // Generate tokens for test users
  testUserToken = jwt.sign({ username: "u1", isAdmin: false }, SECRET_KEY);
  testAdminToken = jwt.sign({ username: "u2", isAdmin: true }, SECRET_KEY);
}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testUserToken,
  testAdminToken,
};
