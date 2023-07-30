import React, { useState, useEffect } from 'react';
import styled from 'styled-components'


import wsConnection from './connector/webSocket'

import Messages from "./components/Messages";
import Input from "./components/InputTxt";
import Modal from './components/Modal';
import InputTxt from './components/InputTxt';
import Users from './components/Users'
import {randomColor} from './util'

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

function onSendMesage(text) {
  console.log("send message", text)
}


function App() {
  const [currentMember, setCurrentMember] = useState({})
  const [socket, setSocket] = useState(null)
  const [members, setMembers] = useState([])
  const [messages, setMessages] = useState([])

  console.log("members", members)

 

  useEffect(() => {
    const eventsStream = (e) => {
      const payload = JSON.parse(e.data)
      const color = randomColor()
      console.log("ws", payload, members)
      switch (payload.command) {
        case "WELCOME":
          console.log("WELCOME", payload)
          setCurrentMember({id: payload.params.id, userName: payload.params.name, color })
          setMembers([
            {id: payload.params.id, username: payload.params.name, color },
            ...(payload.params.users.map(({name, ...rest}) => ({...rest, username: name, color: randomColor()})))])
          break;
        case "NEW_USER":
          setMembers((arr) => [...arr, {id: payload.params.id, username: payload.params.name, color }])
          break;
        case "TEXT":
          console.log("TEXT", payload.user_id, members)
          setMessages((arr) => [
            ...arr, 
            {
              id: payload.id,
              user: { 
                id: payload.user_id,
                username: payload.name,
              },
              text: payload.text,
              username: payload.name,
              createdAt: payload.created_at
            }])
          break;
        default:
          console.log("command not found", payload.command)
      }
    }

    if (currentMember.userName) {
      const sw = wsConnection(currentMember.userName, { onMessage: eventsStream })
      setSocket(sw)
    }
    return () => socket?.close()
  }, [currentMember.userName])

  return (
    <Wrapper>
      {!currentMember.userName &&
        (
          <Modal header={"Credentials"} styled={{ width: "25%" }}>
            <InputTxt
              buttonName='Enter'
              styled={{
                flexGrow: 0,
                maxWidth: "200px"
              }}
              placeholder="Enter your user name"
              onSendMessage={(name) =>  setCurrentMember({ userName: name })}
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
            onSendMessage={onSendMesage}
            buttonName="send"
            placeholder="Enter your message and press ENTER"
          />
        </Center>
      </Body>
    </Wrapper>
  );
}





export default App;
