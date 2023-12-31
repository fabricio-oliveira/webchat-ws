import React from 'react'
import styled, { keyframes } from 'styled-components';

const animatetop = keyframes`
    from {top: -300px; opacity: 0}
    to {top: 0; opacity: 1}
`

const Wrapper = styled.div`
    display: block; 
    position: fixed;
    z-index: 1;
    padding-top: 100px;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto; 
    background-color: rgb(0,0,0);
    background-color: rgba(0,0,0,0.4);
`

const Content = styled.div`
     position: relative;
    background-color: #fefefe;
    margin: auto;
    padding: 0;
    border: 1px solid #888;
    width: ${ props => props.$width ?? "80%" };
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);
    -webkit-animation-name: animatetop;
    -webkit-animation-duration: 0.4s;
    animation-name: ${animatetop};
    animation-duration: 0.4s
`

const Header = styled.div`
    padding: 2px 16px;
    background-color: #5cb85c;
    color: white;
`

const Body = styled.div`
    padding: 2px 16px;
`

const Footer = styled.div`
    padding: 2px 16px;
    background-color: #5cb85c;
    color: white;
`

function Modal({ header, children, footer, styled={} }) {
    return (
        <Wrapper>
            <Content $width={styled.width} >
                <Header>
                    <h2>{header}</h2>
                </Header>
                <Body>
                    {children}
                </Body>
                <Footer>
                    {footer}
                </Footer>
            </Content>
        </Wrapper>
    )
}


export default Modal