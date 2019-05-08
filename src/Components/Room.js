import React, { Component } from 'react'
import PropTypes from 'prop-types'
import io from 'socket.io-client'

export default class Room extends Component {
  constructor(props) {
    super(props)
    this.state = {
      messages: [],
      message: '',
      username: '',
      usernameSet: false,
      userTyping: false
    }
    this.socket = io.connect(':4000')
    this.socket.on('global response', data => {
      this.updateMessages(data)
    })
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  setUsername = () => {
    if (this.state.username) {
      this.setState({
        usernameSet: true
      })
    }
  }

  updateMessages = message => {
    const newMessages = this.state.messages.slice()
    newMessages.push({ message: message.message, username: message.username })
    this.setState({
      messages: newMessages
    })
  }

  broadcast = () => {
    this.socket.emit(`broadcast to ${this.props.room} socket`, {
      message: this.state.message,
      username: this.state.username
    })
  }

  emit = () => {
    this.socket.emit(`emit to ${this.props.room} socket`, {
      message: this.state.message,
      username: this.state.username
    })
  }

  blast = () => {
    this.socket.emit(`blast to ${this.props.room} socket`, {
      message: this.state.message,
      username: this.state.username
    })
  }

  render() {
    const messages = this.state.messages.map((message, i) => (
      <div key={i}>
        <h5>{message.username}</h5>
        <p>{message.message}</p>
      </div>
    ))
    return (
      <div className="room">
        <div className="messages">
          {messages}
          {this.state.userTyping && <h4>User Typing</h4>}
        </div>
        <div className="inputs">
          {this.state.usernameSet ? (
            <>
              <h2 className="welcome-message">
                Welcome, {this.state.username}
              </h2>
              <input
                type="text"
                name="message"
                placeholder="Type Message Here"
                value={this.state.message}
                onChange={this.handleChange}
              />
              <div className="buttons">
                <button onClick={this.broadcast}>Broadcast</button>
                <button onClick={this.emit}>Emit</button>
                <button onClick={this.blast}>Blast</button>
              </div>
            </>
          ) : (
            <div className="username-set">
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={this.state.username}
                onChange={this.handleChange}
              />
              <button onClick={this.setUsername}>Set Username</button>
            </div>
          )}
        </div>
      </div>
    )
  }
}

Room.propTypes = {
  room: PropTypes.string
}
