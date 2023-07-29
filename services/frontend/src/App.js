import './App.css';

import React from 'react';
import './App.css';
import Messages from "./components/Messages";
import Input from "./components/Input";


function randomColor() {
  return '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16);
}

//mocks
const member1 = { id: "1", username: "user1", color: randomColor()}
const member2 = { id: "2", username: "user2", color: randomColor()}
const member = member1

const messages = [{id: 1, text: "oi", user: { ...member1}},{id: 2, text: "tchau", user: { ...member2} }]




function onSendMesage() {
    console.log("Send the message")
}


function App() {

  return (
    <div className="App">
    <div className="App-header">
      <h1>WebSocket Chat App</h1>
    </div>
    <Messages
      messages={messages}
      currentUserId={member.id}
    />
    <Input
      onSendMessage={onSendMesage}
    />
  </div>
  );
}





export default App;
