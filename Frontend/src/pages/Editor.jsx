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
  //---------------------------------------------HOOKS---------------------------------------------------------------------
  const [clients, setClients] = useState([]);
  const { roomId } = useParams();
  const navigate = useNavigate();
  const socketRef = useRef(null); //useRef used to store data in multiple renders and even after changing does not rerender
  const location = useLocation(); //We sent data through navigate that we're getting
  const [socketInitialized, setSocketInitialized] = useState(false); //Chatgpt suggestion
  const codeRef = useRef(null); //As the code is in the editorCM.jsx we need to get it here on this page for auto sync

  useEffect(() => {
    const init = async () => {
      //Initialize the socket connection (defined in socket.js\\backend);
      socketRef.current = await initSocket();

      //Handle errors on connection
      function handleErrors(e) {
        console.log("Socket error :: ", e);
        toast.error("Socker Connection Failed , Try again later!");
        navigate("/");
      }
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      //-------------------------JOIN-----------------------------------------------
      //Send an event to server i.e a join event defined in Actions.js Along with this we send some other data

      socketRef.current.emit(ACTIONS.JOIN, {
        //The data
        roomId,
        username: location.state?.userName,
      });

      //-------------------------------LISTEN FOR JOIN---------------------------------------
      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          //Notify every other member except for ourself
          if (username !== location.state.userName) {
            toast.success(`${username} joined the room!`);
            console.log(`${username} joined`);
          }
          setClients(clients);

          //Auto sync on first load but We need to get the code from the editor page to here
          //As for every key stroke the code is changing so we cant use useState insteade we will use useRef
          socketRef.current.emit(ACTIONS.SYNC_CODE, {
            code: codeRef.current,
            socketId,
        });
        }
      );

      //----------------------------LISTEN FOR DISCONNECTION--------------------------
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
    //-----------------------------------------CLEANING------------------------------------------
    //Cleaning function we have to remove these listeners(on) else memory leak will occur
    return () => {
      //Disconnect socket
      socketRef.current?.disconnect();
      //Unsubscribe socket io event
      socketRef.current?.off(ACTIONS.JOINED);
      socketRef.current?.off(ACTIONS.DISCONNECTED);
    };
  }, []);

  //------------------------------HANDLE NO STATE FOUND---------------------------------------
  if (!location.state) {
    return <Navigate to="/" />;
  }

  //------------------------------Function to copy room id button------------------------------
  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID copied successfully!");
    } catch (error) {
      toast.error("Failed to copy Room ID");
    }
  };

  const leaveRoom = () => {
    //Forcefully redirect
    navigate("/");
  };

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
              onClick={copyRoomId}
            >
              <span className="w-full">Copy Room ID</span>
            </button>

            <button
              type="submit"
              className="w-full px-4 py-2 text-base font-semibold text-center text-white transition duration-200 ease-in bg-red-700 shadow-md hover:text-black hover:bg-white focus:outline-none focus:ring-2"
              onClick={leaveRoom}
            >
              <span className="w-full">Leave Room</span>
            </button>
          </div>
        </div>
        <div className="w-4/5 h-auto bg-white p-4 shadow-lg text-gray-600 rounded-sm">
          <div className="mt-4 mb-4 shadow-lg">Editor</div>
          {socketInitialized ? (
            <EditorCM
              socketRef={socketRef}
              roomId={roomId}
              onCodeChange={(code) => {
                codeRef.current = code;
                //We're not getting the code here
                 console.log("This is the code incoming from onCodeChange from Editor Component",code);
                 console.log("this is the codeRef",codeRef.current);
              }}
            /> //onCodeChange for auto sync
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
