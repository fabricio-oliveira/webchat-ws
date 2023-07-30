import React from "react";
import styled from "styled-components"

import Message from './Message'

const Ul = styled.ul`
    padding: 20px 0;
    max-width: 900px;
    height: 100%;
    width: 80%;
    margin: 0 auto;
    list-style: none;
    padding-left: 0;
    flex-grow: 1;
    overflow: auto;
    /* flex-direction: column-reverse; */
` 

function Messages({messages, currentMember, members}) {
  
  console.log("messges", messages)
  
  return (
    <Ul>
        {messages.map(m => { 
          const msgMember = members.find(({id}) => id === m.user.id)
          return Message({ ...m, msgMember, currentUserId: currentMember.id})
        })
      }
      </Ul>
    );
  }



export default Messages;