const fs = require('fs');
const path = require('path');

function saveUser(user) {
  const filePath = path.join(__dirname, '..', 'tmp', 'created-users.json');
  let users = [];
  if (fs.existsSync(filePath)) {
    users = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }
  users.push(user);
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
  return null;
}

module.exports = { saveUser };
