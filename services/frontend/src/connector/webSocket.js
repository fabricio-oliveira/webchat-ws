const url = `ws://${process.env.REACT_APP_WS_SERVICE}/api/v1/chats/default`

function openConnction(userName, {
    onOpen = () => { },
    onClose = () => { },
    onMessage = () => { },
    onError = () => { },
    extra={},
}
) {
    const socket = new WebSocket(`${url}?name=${userName}`);
      socket.addEventListener('open', onOpen)
      socket.addEventListener('close', onClose)
      socket.addEventListener("message", onMessage);
      socket.addEventListener("message", onError);

      return socket
}

export default openConnction