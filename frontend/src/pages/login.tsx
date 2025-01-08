import { useNavigate } from "react-router-dom";
import { useRef, useEffect } from "react";

export function Login() {
  const navigate = useNavigate();
  const ws = useRef<WebSocket | null>(null); 

  useEffect(() => {
    if (!ws.current) {
      ws.current = new WebSocket("https://chatty-hrhv.onrender.com");
    }

    return () => {
      ws.current?.close();
    };
  }, []); 

  function newroom() {
    if (ws.current) {
      ws.current.send(
        JSON.stringify({
          type: "createRoom",
        })
      );

      ws.current.onmessage = (event: MessageEvent) => {
        const data = JSON.parse(event.data);
        if (data.type === "roomCreated") {
          const roomId = data.payload.roomId;
          navigate(`/chat?roomId=${roomId}`);
        }
      };
    }
  }

  return (
    <div className="h-screen flex justify-center items-center bg-black">
      <div className="h-60 w-96 bg-white rounded-3xl">
        <div className="text-4xl font-extrabold p-6">Welcome to Chatty</div>
        <div className="flex flex-row m-4">
          <button
            onClick={() => {
              navigate("/join");
            }}
            className="mx-14 bg-lime-400 rounded-3xl p-3"
          >
            Join a room
          </button>
          <button onClick={newroom} className="bg-lime-400 rounded-3xl p-3">
            Create a room
          </button>
        </div>
      </div>
    </div>
  );
}
