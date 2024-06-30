import React, { useState } from "react";
import Clients from "../components/Clients";
import EditorCM from "../components/EditorCM";

function Editor() {
  const [clients, setClients] = useState([
    {
      socketId: 1,
      username: "Vaibhav Shukla",
    },
    {
      socketId: 2,
      username: "Ankit Gupta",
    },
    {
      socketId: 3,
      username: "John Doe",
    },
    {
      socketId: 4,
      username: "Robert Downey Jr.",
    },
    {
      socketId: 5,
      username: "Kailash kher",
    },
  ]);

  return (
    <>
      <div className="flex flex-wrap flex-auto">
        <div className="w-1/5 bg-white p-6 text-white rounded-sm shadow-lg">
          <div
            className="w-full px-4 py-2 mb-2 mt-0 text-base font-semibold text-center text-black transition duration-200 ease-in bg-white shadow-md hover:text-white hover:bg-black focus:outline-none focus:ring-2
"
          >
            Members Joined
          </div>
          <div className="container flex flex-col items-center justify-center w-full mx-auto">
            <ul className="flex flex-col">
              {clients.map((client) => {
                return (
                  <Clients key={client.socketId} username={client.username} />
                );
              })}
            </ul>

            <button
              type="submit"
              className="w-full px-4 py-2 mb-2 text-base font-semibold text-center text-white transition duration-200 ease-in bg-black shadow-md hover:text-black hover:bg-white focus:outline-none focus:ring-2"
            >
              <span className="w-full">Copy Room ID</span>
            </button>

            <button
              type="submit"
              className="w-full px-4 py-2 text-base font-semibold text-center text-white transition duration-200 ease-in bg-red-700 shadow-md hover:text-black hover:bg-white focus:outline-none focus:ring-2"
            >
              <span className="w-full">Leave Room</span>
            </button>
          </div>
        </div>
        <div className="w-4/5 h-auto bg-white p-4 shadow-lg text-gray-600 rounded-sm">
          <div className="mt-4 mb-4">Editor</div>
          <EditorCM />
        </div>
      </div>
    </>
  );
}

export default Editor;
