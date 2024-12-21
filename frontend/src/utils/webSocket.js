import { over } from "stompjs";

let stompClient = null;
/**
 * Establish a WebSocket connection and subscribe to game updates.
 * @param {string} gameId - The ID of the game to subscribe to.
 * @param {function} onMessageReceived - Callback for receiving game state updates.
 */
export const connectToWebSocket = (gameId, onMessageReceived, onOpen, onActionRecived) => {
  const socket = new WebSocket("ws://localhost:8080/ws");
  stompClient = over(socket);

  stompClient.connect({}, () => {
    console.log("Connected to WebSocket");

    // Subscribe to updates for the specific game
    if(stompClient.connected){
      stompClient.subscribe(`/state/game/${gameId}`, (message) => {
        console.log("Received message:", message.body);
        onMessageReceived(JSON.parse(message.body));
      });
      onOpen();

      stompClient.subscribe(`/action/game/${gameId}`, (message) => {
        console.log("Received action:", message.body);
        onActionRecived(JSON.parse(message.body));
      });
    }
  });
};

export const wsJoinGame = (gameId) => {
  console.log("Joining game:", gameId, "i got called");
  if (!stompClient || !stompClient.connected) {
    console.error("WebSocket is not connected. Cannot send join status.");
    return;
  }
  stompClient.send(
    `/app/join/${gameId}`,
    {},
  );
};

/**
 * Send a move to the server.
 * @param {string} gameId - The ID of the game.
 * @param {number} row - The row index of the move.
 * @param {number} col - The column index of the move.
 */
export const processMove = (gameId, row, col) => {
  if (!stompClient || !stompClient.connected) {
    console.error("WebSocket is not connected. Cannot send move.");
    return;
  }
  stompClient.send(
    `/app/move/${gameId}`,
    {}, // Headers (empty in this case)
    JSON.stringify({ row, col }) // Payload
  );
};

export const disconnectWebSocket = () => {
  if (stompClient) {
    stompClient.disconnect();
  }
}


export const wsEndGame = (gameId) => {
  if(!stompClient || !stompClient.connected){
    console.error("WebSocket is not connected. Cannot send end game.");
    return;
  }
  stompClient.send(
    `/app/over/${gameId}`,
    {},
  );
}

export const wsRestartGame = (gameId) => {
  if(!stompClient || !stompClient.connected){
    console.error("WebSocket is not connected. Cannot send end game.");
    return;
  }
  stompClient.send(
    `/app/reset/${gameId}`,
    {},
  );
}