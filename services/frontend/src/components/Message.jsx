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
    
    text-align: ${props => props.$userTye == USER_ME ? 'right' : 'left'};
    align-items: ${props => props.$userTye == USER_ME ? 'flex-start' : 'flex-end'};
    flex-direction: ${props => props.$userTye == USER_ME ? 'row-reverse' : 'row'};
    justify-content: ${props => props.$userTye == USER_SERVER ? 'center' : 'default'};;
`

const Text = styled.div`
    padding: 10px;
    max-width: 400px;
    margin: 0;
    border-radius: 12px;
    background-color: ${props => props.$color};
    color: white;
    display: inline-block;
`


const Notify = styled.div`
    padding: 5px;
    max-width: 400px;
    margin: 0;
    border-radius: 10px;
    background-color: #47A7F0;
    color: black;
    font-size: 12px;
    display: inline-block;
`
const USER_SERVER = "SERVER"
const USER_ME = "ME"
const USER_OTEHRS = "OTHERS"


function Message({ id, userId, userName, text, currentUserId, msgMember }) {
    const userTye = userId === currentUserId ? USER_ME : (userName == USER_SERVER ? USER_SERVER : USER_OTEHRS)

    return (
        <Wrapper key={id} $userTye={userTye}>

            {userTye != USER_SERVER && <Avatar
                style={{ backgroundColor: msgMember?.color }}
            />}
            <Content>
                {userTye != USER_SERVER &&
                    <UserName>
                        {userName}
                    </UserName>}

                {userTye === USER_SERVER ?
                    <Notify>{text}</Notify> :
                    <Text $color={msgMember?.color}>{text}</Text>
                }

            </Content>
        </Wrapper>
    );
}


export default Message