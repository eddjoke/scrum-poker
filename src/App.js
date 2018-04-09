import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';
import { UserCard } from './components';

const socket = socketIOClient('http://192.168.0.102:4001');

const Loader = () => <p className="mt-5">Loading...</p>;

class App extends Component {
  constructor() {
    super();
    this.state = {
      socket,
      username: '',
      cardValue: undefined,
      userRegistered: false,
      socketState: undefined,
    };
  }

  componentDidMount() {
    socket.on('state', data => this.setState({ socketState: data }));
  }

  setCardValue = value => {
    this.state.socket.emit('set-card-value', value);
    this.setState({ cardValue: value });
  };

  handleUsernameChange = e => {
    this.setState({ username: e.target.value });
    e.preventDefault();
  };

  handleUsernameSumbit = e => {
    this.state.socket.emit('set-username', this.state.username);
    this.setState({ userRegistered: true });
    e.preventDefault();
  };

  render() {
    const { socketState } = this.state;
    const cards = ['0', '1/2', '1', '2', '3', '5', '8', '13'];
    const isUserRegistered =
      this.state.username != null && this.state.userRegistered;
    return (
      <div>
        {socketState ? (
          <div>
            <div className="bg-dark">
              <div className="container">
                <div className="row p-5">
                  <div className="col-12">
                    <div className="d-flex flex-wrap justify-content-between">
                      {isUserRegistered ? (
                        <p>
                          User: <strong>{this.state.username}</strong>
                        </p>
                      ) : (
                        <form onSubmit={this.handleUsernameSumbit}>
                          Your username:{' '}
                          <input
                            type="text"
                            id="username"
                            value={this.state.value}
                            onChange={this.handleUsernameChange}
                          />
                        </form>
                      )}
                      <p
                        className={
                          socketState.serverStatus === 'Connected'
                            ? 'c-gre-5'
                            : undefined
                        }
                      >
                        {socketState.serverStatus}
                      </p>
                      <p>Users connected: {socketState.users.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="container">
              <div className="row">
                <div className="xs-12">
                  {socketState.users.map(({ username, cardValue }, index) => (
                    <UserCard
                      key={index}
                      username={username}
                      cardValue={cardValue || '?'}
                      className="m-5"
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="container">
              <div className="row">
                <div className="xs-12">
                  <p>Set card value: </p>
                  {cards.map((card, index) => (
                    <button
                      key={index}
                      className="btn btn-secondary m-3"
                      onClick={() => this.setCardValue(card)}
                      disabled={card === this.state.cardValue}
                    >
                      {card}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="container">
              <div className="row">
                <div className="xs-12">
                  <pre>{JSON.stringify(socketState.users, null, 2)}</pre>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Loader />
        )}
      </div>
    );
  }
}

export default App;
