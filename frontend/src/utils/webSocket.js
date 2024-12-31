import { over } from "stompjs";

let stompClient = null;
let reconnectAttempts = 0;
const maxReconnectAttempts = 10;
const reconnectDelay = 2000;

/**
 * Establish a WebSocket connection and subscribe to game updates.
 * @param {string} gameId - The ID of the game to subscribe to.
 * @param {function} onMessageReceived - Callback for receiving game state updates.
 */
export const connectToWebSocket = (gameId, onMessageReceived, onOpen, onActionRecived) => {
  const socket = new WebSocket("wss://tic-tac-toe.duckdns.org/api/ws");
  stompClient = over(socket);


  const reconnect = () => {
    if (reconnectAttempts < maxReconnectAttempts) {
      setTimeout(() => {
        console.log(`Reconnecting... Attempt ${reconnectAttempts + 1}`);
        reconnectAttempts++;
        connectToWebSocket(gameId, onMessageReceived, onOpen, onActionRecived);
      }, Math.min(reconnectDelay * reconnectAttempts, 10000)); // Cap delay at 10 seconds
    } else {
      console.error("Max reconnection attempts reached. Could not reconnect to WebSocket.");
    }
  };

  socket.onclose = () => {
    console.warn("WebSocket connection closed. Attempting to reconnect...");
    reconnect();
  };

  socket.onerror = (error) => {
    console.error("WebSocket encountered an error:", error);
    socket.close(); // Trigger `onclose` to handle reconnection
  };

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
export const processMove = (gameId, outerRow, outerCol, innerRow, innerCol) => {
  if (!stompClient || !stompClient.connected) {
    console.error("WebSocket is not connected. Cannot send move.");
    return;
  }
  stompClient.send(
    `/app/move/${gameId}`,
    {}, // Headers (empty in this case)
    JSON.stringify({ outerRow, outerCol, innerRow, innerCol }) // Payload
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

export const checkConnection = () => {
  return stompClient.connected;
}