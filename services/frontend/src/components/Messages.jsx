import React from "react";
import Message from './Message'

function Messages({messages, currentUserId}) {
    return (
      <ul className="Messages-list">
        {messages.map(m => Message({ ...m, currentUserId}))}
      </ul>
    );
  }



export default Messages;