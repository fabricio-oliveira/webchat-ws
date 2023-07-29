import React from 'react'

function Message({ id, user, text, currentUserId }) {
    console.log("123", user, currentUserId) 
    const messageFromMe = user.id === currentUserId;
    
    const className = messageFromMe ?
        "Messages-message currentMember" : "Messages-message";

    return (
        <li key={id} className={className}>
            <span
                className="avatar"
                style={{ backgroundColor: user.color }}
            />
            <div className="Message-content">
                <div className="username">
                    {user.username}
                </div>
                <div className="text">{text}</div>
            </div>
        </li>
    );
}


export default Message