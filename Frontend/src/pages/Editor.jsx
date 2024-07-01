import React, { useEffect, useRef, useState } from "react";
import Clients from "../components/Clients";
import EditorCM from "../components/EditorCM";
import { initSocket } from "../../../Backend/socket";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import ACTIONS from "../../Actions";
import toast from "react-hot-toast";

function Editor() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  //useRef used to store data in multiple renders
  //and even after changing does not rerender
  const socketRef = useRef(null);
  const location = useLocation(); //We sent data through navigate that we're getting

  //Chatgpt suggestion
  const [socketInitialized, setSocketInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      //From backend initialize the initSocket function made in backend
      socketRef.current = await initSocket();
      //console.log("Socket.current on Editor.jsx : ",socketRef.current);

      //Handle errors on connection
      function handleErrors(e) {
        console.log("Socket error :: ", e);
        toast.error("Socker Connection Failed , Try again later!");
        navigate("/");
      }
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      //Send an event to server i.e a join event defined in Actions.js
      //Along with this we send some other data
      socketRef.current.emit(ACTIONS.JOIN, {
        //The data
        roomId,
        username: location.state?.userName,
      });

      //Listening for joined event we will recieve data which we sent
      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          //As we are first getting joined and then getting all the clients connected
          //So we dont have to notify myself
          //But others only
          if (username !== location.state.userName) {
            toast.success(`${username} joined the room!`);
            console.log(`${username} joined`);
          }

          setClients(clients);
        }
      );

      //Listening for user disconnection
      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room!`);
        //Update the clients list
        setClients((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
      });
      setSocketInitialized(true);
    };
    init();

    //Cleaning function we have to remove these listeners(on) else memory leak will occur
    return () => {
      //Disconnect socket
      socketRef.current?.disconnect();
      //Unsubscribe socket io event
      socketRef.current?.off(ACTIONS.JOINED);
      socketRef.current?.off(ACTIONS.DISCONNECTED);
    };
  }, []);

  const [clients, setClients] = useState([]);

  //If no username or id forcefully navigate to /
  if (!location.state) {
    return <Navigate to="/" />;
  }

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
          {socketInitialized ? (
            <EditorCM socketRef={socketRef} roomId={roomId} />
          ) : (
            <div>Loading...</div>
          )}
          {/* <EditorCM socketRef={socketRef} roomId={roomId}/> */}
        </div>
      </div>
    </>
  );
}

export default Editor;
