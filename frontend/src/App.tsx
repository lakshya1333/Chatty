import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import "./App.css";

function App() {
  const [messages, setMessages] = useState<string[]>([]);
  const [error, setError] = useState("");
  const wf = useRef();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const roomId = queryParams.get("roomId");

  useEffect(() => {
    if (!roomId) {
      alert("Room ID is required!");
      return;
    }

    setMessages([`Hello, your room ID is: ${roomId}. You can share it with others to join this anonymous chatroom`]);

    const ws = new WebSocket("https://chatty-hrhv.onrender.com");
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
    
        if (data.type === "error") {
          setError(data.message);
          return;
        }
    
        if (data.type === "joined") {
          setError("");
        }
    
        if (data.type === "chat") {
          setMessages((m) => [...m, data.payload.message]);
        }
      } catch (error) {
        console.error("Failed to parse WebSocket message:", event.data, error);
      }
    };

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join",
          payload: {
            roomId: roomId,
          },
        })
      );
    };

    wf.current = ws;

    return () => {
      ws.close();
    };
  }, [roomId]);

  return (
    <div className="h-screen bg-black">
      <br />
      {error ? (
        <div className="bg-red-500 text-white p-4 text-center">{error}</div>
      ) : (

        <>
          <div className="h-[90vh] overflow-y-auto flex flex-col items-start">
            {messages.map((message, index) => (
              <div
              key={index}
              className="m-2 w-full flex"
              >
          <span
            className="bg-white text-black rounded p-4 break-words max-w-[90%] w-fit"
            >
            {message}
          </span>
         </div>
  ))}
</div>

          <div className="w-full bg-white flex">
            <input id="message" className="flex-1 p-4" type="text"></input>
            <button
              onClick={() => {
                const message = document.getElementById("message")?.value;
                if (wf.current?.readyState === WebSocket.OPEN) {
                  wf.current.send(
                    JSON.stringify({
                      type: "chat",
                      payload: {
                        message: message,
                      },
                    })
                  );
                }
              }}
              className="bg-purple-600 text-white p-4"
            >
              Send Message
            </button>
          </div>
        </>
      )}
    </div>
  );
  
}

export default App;
