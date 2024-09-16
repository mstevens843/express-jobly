const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

/** return signed JWT from user data. */

function createToken(user) {
  console.assert(
    typeof user.isAdmin !== "undefined",
    "createToken passed user without isAdmin property"
  );

  let payload = {
    username: user.username,
    // Ensuring isAdmin is explicitly set to either true or false.
    isAdmin: user.isAdmin === true,
  };

  return jwt.sign(payload, SECRET_KEY);
}

module.exports = { createToken };
