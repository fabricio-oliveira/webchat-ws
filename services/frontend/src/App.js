import React, { useState, useEffect } from 'react';
import styled from 'styled-components'


import wsConnection from './connector/webSocket'

import Messages from "./components/Messages";
import Input from "./components/InputTxt";
import Modal from './components/Modal';
import InputTxt from './components/InputTxt';
import Users from './components/Users'
import { randomColor } from './util'

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100vh;
`

const Header = styled.div`
    background-color: #262626;
    overflow: visible;
    width: 100%;
    text-align: center;
    color: white;
`

const Body = styled.div`
  display: flex;
  height: 85%;
  padding: 0 10px 20px 10px;
`

const Center = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  padding: 0 10px 0 10px;
  flex-direction: column;
`

const CMD_WELCOME = "WELCOME"
const CMD_NEW_USER = "NEW_USER"
const CMD_USER_LEAVE = "USER_LEAVE"
const CMD_TEXT = "TEXT"

const MAX_MESSAGES = 50




function App() {
  const [currentMember, setCurrentMember] = useState({})
  const [socket, setSocket] = useState(null)
  const [members, setMembers] = useState([])
  const [messages, setMessages] = useState([])


  const onSendMessage = (text) => {
    socket.send(text)
  }

  useEffect(() => {
    if (currentMember?.userName) {
      const eventsStream = (e) => {
        const payload = JSON.parse(e.data)
        const color = randomColor()
        switch (payload.command) {
          case CMD_WELCOME:
            const member = { id: payload.params.id, userName: payload.params.name, color, active: true }
            setCurrentMember(member)
            setMembers([member,
              ...(payload.params.users.map(({ name, ...rest }) => ({ ...rest, userName: name, active: true, color: randomColor() })))])
            setMessages((arr) => [
              {
                id: payload.id,
                userId: payload.user_id,
                userName: payload.name,
                text: payload.text,
                createdAt: payload.created_at
              },
              ...arr
            ])
            break;
          case CMD_NEW_USER:
            setMembers((arr) => [...arr, { id: payload.params.id, userName: payload.params.name, active: true, color }])
            setMessages((arr) => [
              {
                id: payload.id,
                userId: payload.user_id,
                userName: payload.name,
                text: payload.text,
                createdAt: payload.created_at
              },
              ...arr
            ])
            break;
          case CMD_USER_LEAVE:
            const userId = payload.params.id
            setMembers((arr) => arr.map(({ id, active, ...rest }) => ({ id, ...rest, active: id !== userId ? active : false })))
            setMessages((arr) => [
              {
                id: payload.id,
                userId: payload.user_id,
                userName: payload.name,
                text: payload.text,
                createdAt: payload.created_at
              },
              ...arr
            ])
            break;
          case CMD_TEXT:
            setMessages((arr) => [
              {
                id: payload.id,
                userId: payload.user_id,
                userName: payload.name,
                text: payload.text,
                createdAt: payload.created_at
              }, ...arr.slice(0, MAX_MESSAGES)])
            break;
          default:
            console.log("command not found", payload.command)
        }
      }

      const sw = wsConnection(currentMember?.userName, { onMessage: eventsStream })
      setSocket(sw)
    }
    return () => socket?.close()
  }, [currentMember?.userName])

  return (
    <Wrapper>
      {!currentMember?.userName &&
        (
          <Modal header={"nick name"} styled={{ width: "25%" }}>
            <InputTxt
              buttonName='Enter'
              styled={{
                flexGrow: 0,
                maxWidth: "300px"
              }}
              placeholder="Enter user name"
              onSendMessage={(name) => setCurrentMember({ userName: name })}
            />

          </Modal>
        )
      }

      <Header>
        <h1>WebSocket Chat App</h1>
      </Header>
      <Body>
        <Users
          members={members}
          currentMember={currentMember}
        />
        <Center>
          <Messages
            messages={messages}
            currentMember={currentMember}
            members={members}
          />
          <Input
            onSendMessage={onSendMessage}
            buttonName="send"
            placeholder="Enter your message and press ENTER"
          />
        </Center>
      </Body>
    </Wrapper>
  );
}





export default App;
