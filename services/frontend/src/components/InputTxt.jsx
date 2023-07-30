import React, { useState } from "react";
import styled from "styled-components";


const Button = styled.button`
  padding: 5px 10px;
  font-size: 16px;
  background-color: orangered;
  color: white;
  border: none;
  border-radius: 8px;
  margin-left: 10px;
`

const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  width: 100%;
  justify-content: space-around;
  max-width: ${ props => props.$maxWidth  ?? "850px"};
  margin: 0 auto 10px;
`

const Input = styled.input`
  padding: 5px;
  font-size: 16px;
  border-radius: 8px;
  width: 60%;
  border: 1px solid orangered;
  flex-grow: ${ props => props.$flexGrow  ?? 1};
`

function InputTxt({onSendMessage, buttonName, placeholder, styled={}}) {
  const [text, setText] = useState("")
  
  const onChange = (e) =>{
    setText(e.target.value);
  }

  const onSubmit = (e) => {
    e.preventDefault();
    setText("");
    onSendMessage(text);
  }
  
  return (
    <>
      <Form onSubmit={e => onSubmit(e)} $maxWidth={styled.maxWidth}>
        <Input
          onChange={e => onChange(e)}
          value={text}
          type="text"
          placeholder={placeholder}
          autoFocus={true}
          $flexGrow={styled.flexGrow}
         
        />
        <Button>{buttonName}</Button>
      </Form>
    </>
  )
}

export default InputTxt;