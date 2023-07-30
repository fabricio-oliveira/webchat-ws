import React from "react";
import styled from "styled-components"

import Message from './Message'

const Ul = styled.ul`
    display: flex;
    flex-direction: column-reverse;
    flex-grow: 1;
    
    padding: 20px 0;
    padding-left: 0;
    max-width: 900px;
    height: 100%;
    width: 80%;

    margin: 0 auto;
    list-style: none;
    overflow: auto;
`

function Messages({ messages, currentMember, members }) {
  return (
    <Ul>
      {
        messages.map(m => {
          const msgMember = members.find(({ id }) => id === m.userId)
          return Message({ ...m, msgMember, currentUserId: currentMember.id })
        })
      }
    </Ul>
  );
}



export default Messages;