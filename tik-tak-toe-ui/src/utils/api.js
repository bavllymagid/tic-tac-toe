const API_BASE = "https://34.155.145.29:8080/tic-tac-toe";

export const createGame = async () => {
  const response = await fetch(`${API_BASE}/create`);
  if (response.ok) {
    const data = await response.json(); // Parse the JSON response
    console.log("Create Game response:", data); // Log to verify the response
    return data; // Ensure `data` contains the `id` field
  }
  throw new Error("Failed to create game");
};



export const joinGame = async (gameId) => {
  const response = await fetch(`${API_BASE}/join/${gameId}`);
  if (response.ok) {
    return response.json();
  }
  throw new Error("Game not found");
};

export const endGame = async (gameId) => {
  const response = await fetch(`${API_BASE}/over/${gameId}`, { method: "DELETE" });
  if (!response.ok) {
    throw new Error("Failed to end game");
  }
};
