let socket: WebSocket | null = null;

export const connectWebSocket = (
  onMessage: (data: any) => void
) => {
  socket = new WebSocket("ws://localhost:8000/ws/frontend");

  socket.onopen = () => {
    console.log("WebSocket connected");
  };

  socket.onmessage = (event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch (err) {
      console.error("Invalid JSON:", err);
    }
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  socket.onclose = () => {
    console.log("WebSocket disconnected");
  };
};

export const disconnectWebSocket = () => {
  if (socket) {
    socket.close();
    socket = null;
  }
};

export const isWebSocketConnected = () => 
  socket !== null && socket.readyState === WebSocket.OPEN;
