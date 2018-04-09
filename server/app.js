const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const port = process.env.PORT || 4001;
const index = require('./routes/index');

const app = express();

app.use(index);

const server = http.createServer(app);
const io = socketIo(server);

const state = {
  users: [],
  serverStatus: undefined,
};

const registerNewUser = userId => {
  // console.log("New client connected: ", userId);
  state.users.push({ userId });
};

const updateUserById = (id, data) => {
  console.log(id, data);
  const updatedItems = state.users.map(item => {
    if (item.userId === id) {
      return { ...item, ...data };
    }
    return item;
  });
  console.log(updatedItems);
  state.users = updatedItems;
};

const unregisterUser = userId => {
  // console.log("Client disconnected", userId);
  const newUsersList = state.users.filter(obj => obj.userId !== userId);
  state.users = newUsersList;
};

const pushStateToClient = () => {
  io.sockets.emit('state', state);
};

io.on('connection', socket => {
  state.serverStatus = 'Connected';
  registerNewUser(socket.id);

  // fake trottling for loader to be shown, since development speed is to fast
  setTimeout(() => pushStateToClient(socket), 1000);

  console.log(state);

  socket.on('disconnect', () => {
    state.serverStatus = 'Disconnected';
    unregisterUser(socket.id);
    pushStateToClient(socket);
  });

  socket.on('set-username', name => {
    updateUserById(socket.id, { username: name });
    pushStateToClient();
  });

  socket.on('set-card-value', value => {
    updateUserById(socket.id, { cardValue: value });
    pushStateToClient();
  });
});

server.listen(port, () =>
  console.log(`Listening on port http://localhost:${port}`)
);
