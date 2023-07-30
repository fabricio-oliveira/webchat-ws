import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
    border: 1px solid red;
  
    width: 20%;
    height: 100%;

    display: flex;
    flex-direction: column;
    text-align: center;

    font-weight: bold;
`


const Header = styled.div`
    padding: 0 3px 0 3px;
    background-color: #D75656;
`


const Body = styled.div`
    padding: 0 3px 0 3px;
`


const Ul = styled.ul`
    padding: 20px 0;
    width: 100%;
    margin: 0 auto;
    list-style: none;
    padding-left: 0;
    flex-grow: 1;
    overflow: auto;
`

const UserName = styled.li`
    display: flex;
    margin-top: 10px;
    font-weight: ${ props => props.$isItMe? "bold" : "normal" };
    background-color: ${ props => props.$bgColor };
`

function Users({ members = [], currentMember }) {
    console.log("debug", members)
    return (
        <Wrapper>
            <Header>
                <p>users</p>
            </Header>
            <Body>
                <Ul>
                    {members.filter(({active}) => active).map(({id, userName, color}) => (
                        <UserName key={id} 
                            $isItMe={currentMember.id === id}
                            $bgColor={color} >
                            {userName}
                        </UserName>
                    ))}
                </Ul>
            </Body>
        </Wrapper>
    )

}


export default Users