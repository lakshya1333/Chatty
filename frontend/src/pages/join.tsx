import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function Join() {
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  const handleJoin = () => {
    if (roomId.trim() !== "") {
      navigate(`/chat?roomId=${roomId}`);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-black">
      <div className="h-60 w-96 bg-white rounded-3xl">
        <div className="text-4xl font-extrabold p-6">
          Enter the Room ID to join the chat
        </div>
        <div className="flex flex-row m-4 items-center">
          RoomId:
          <input
            className="bg-slate-400 m-3 p-2"
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <button
            className="bg-lime-400 rounded-3xl p-3"
            onClick={handleJoin}
          >
            Join
          </button>
        </div>
      </div>
    </div>
  );
}
