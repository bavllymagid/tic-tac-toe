import { over } from "stompjs";

let stompClient = null;

/**
 * Establish a WebSocket connection and subscribe to game updates.
 * @param {string} gameId - The ID of the game to subscribe to.
 * @param {function} onMessageReceived - Callback for receiving game state updates.
 */
export const connectToWebSocket = (gameId, onMessageReceived) => {
  const socket = new WebSocket("ws://localhost:8080/tic-tac-toe");
  stompClient = over(socket);

  stompClient.connect({}, () => {
    console.log("Connected to WebSocket");

    // Subscribe to updates for the specific game
    stompClient.subscribe(`/topic/game/${gameId}`, (message) => {
      onMessageReceived(JSON.parse(message.body));
    });
  });
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
    {},
    JSON.stringify({ row, col })
  );
};
