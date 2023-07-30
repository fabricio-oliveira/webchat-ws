import React from 'react'
import styled from "styled-components"

const Content = styled.div`
    display: inline-block;
`

const UserName = styled.div`
    display: block;
    color: gray;
    font-size: 14px;
    padding-bottom: 4px;
`

const Avatar = styled.span`
    height: 35px;
    width: 35px;
    border-radius: 50%;
    display: inline-block;
    margin: 0 10px -10px;
`

const Wrapper = styled.li`
    display: flex;
    margin-top: 10px;
    
    flex-direction: row-reverse;
    text-align: ${props => props.isItMe ? 'right' : 'left' };
    align-items: ${props => props.isItMe ? 'flex-start' : 'flex-end' };
    flex-direction: ${props => props.$isItMe ? ' row-reverse' : 'row' };;
` 

const Text =  styled.div`
    padding: 10px;
    max-width: 400px;
    margin: 0;
    border-radius: 12px;
    background-color: ${props => props.$color };
    color: white;
    display: inline-block;
` 


function Message({ id, user, text, currentUserId, msgMember }) {
    const isItMe = user.id === currentUserId;
    console.log("isItMe", msgMember)

    return (
        <Wrapper key={id} $isItMe={isItMe}>
            <Avatar
                style={{ backgroundColor: msgMember.color }}
            />
            <Content>
                <UserName>
                    {user.username}
                </UserName>
                <Text $color={msgMember.color}>{text}</Text>
            </Content>
        </Wrapper>
    );
}


export default Message