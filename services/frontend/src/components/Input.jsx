import React, { useState } from "react";


function Input({member}) {
  const [text, setText] = useState("")
  

  const onChange = (e) =>{
    console.log("onChange", e)
  }

  const onSendMessage = (message) => {
    const messages = text
    messages.push({
      text: message,
      member: member
    })
    this.setState({messages: messages})
  }

  const onSubmit = (e) => {
    e.preventDefault();
    setText("");
    onSendMessage(text);
  }
  
  return (
    <div className="Input">
      <form onSubmit={e => onSubmit(e)}>
        <input
          onChange={e => onChange(e)}
          value={text}
          type="text"
          placeholder="Enter your message and press ENTER"
          autoFocus={true}
        />
        <button>Send</button>
      </form>
    </div>
  )
}

export default Input;