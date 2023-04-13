//users state
const users = [];

function join(id, userName, room) {
  const user = { id, userName, room };

  users.push(user);

  return user;
}

function getCurrent(id) {
  return users.find((user) => user.id === id);
}

function leave(id) {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

function roomUsers(room) {
  return users.filter((user) => user.room === room);
}

module.exports = {
  join,
  getCurrent,
  leave,
  roomUsers,
};
