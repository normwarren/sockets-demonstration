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
    this.socket.on('global response', data => this.updateMessages(data))
    this.socket.on('room response', data => this.updateMessages(data))
    this.socket.on('typing', () => this.setTyping())
    this.socket.on('stopped typing', () => this.stopTyping())
  }

  componentDidMount = () => {
    if (this.props.room !== 'global') {
      this.socket.emit('join room', {room: this.props.room})
    }
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value }, () => {
      if (this.state.message) {
        this.socket.emit('typing', { room: this.props.room })
      } else {
        this.socket.emit('stopped typing', { room: this.props.room })
      }
    })
  }

  setUsername = () => {
    if (this.state.username) {
      this.setState({
        usernameSet: true
      })
    }
  }

  setTyping = () => {
    this.setState({ userTyping: true })
  }

  stopTyping = () => {
    this.setState({ userTyping: false })
  }

  updateMessages = data => {
    console.log(data)
    this.setState({
      messages: [...this.state.messages, {message: data.message, username: data.username}]
    })
  }

  broadcast = () => {
    this.socket.emit(
      `broadcast to ${this.props.room !== 'global' ? 'room' : 'global'} socket`,
      {
        message: this.state.message,
        username: this.state.username,
        room: this.props.room
      }
    )
  }

  emit = () => {
    this.socket.emit(
      `emit to ${this.props.room !== 'global' ? 'room' : 'global'} socket`,
      {
        message: this.state.message,
        username: this.state.username,
        room: this.props.room
      }
    )
  }

  blast = () => {
    this.socket.emit(
      `blast to ${this.props.room !== 'global' ? 'room' : 'global'} socket`,
      {
        message: this.state.message,
        username: this.state.username,
        room: this.props.room
      }
    )
  }

  render() {
    const messages = this.state.messages.map((message, i) => (
      <div
        key={i}
        className={
          message.username === this.state.username ? 'my-message' : 'message'
        }
      >
        <h5>{message.username}</h5>
        <p>{message.message}</p>
      </div>
    ))
    return (
      <div className="room">
        <h2>{this.props.room}</h2>
        <div className="messages">
          {messages}
          {this.state.userTyping && (
            <h4 className="typing-message">User Typing...</h4>
          )}
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
                placeholder="Enter Username"
                value={this.state.username}
                onChange={this.handleChange}
              />
              <button onClick={this.setUsername}>Set</button>
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
