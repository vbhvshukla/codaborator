import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import { Navigate, useNavigate } from "react-router-dom";


function Home() {
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const createNewRoom = (e) => {
    //To not refresh the page the button is clicked
    e.preventDefault;

    //Generate a new room ID
    const id = uuidv4();

    //Push the id into the state
    setRoomId(id);

    //Push a toast
    toast.success("Room Created Successfully!");
  };

  //Function to join room
  const joinRoom = () => {
    if (!roomId || !userName) {
      toast.error("Room ID or Username Invalid!");
      return;
    }
    //Redirect
    navigate(`/editor/${roomId}`,{
        state: {userName} // Pass data from one route to another through this state option. Another way is to store it in redux
    });
    
  };

 //Function so that we if press enter on keyboard it automatically executes joinroom
 const handleInputEnter = (e) => {
    if(e.code === 'Enter'){
        joinRoom();
    }
 }
  return (
    <div class="flex flex-wrap w-full">
      <div class="flex flex-col w-full md:w-1/2">
        <div class="flex justify-center pt-12 md:justify-start md:pl-12 md:-mb-24">
          <a href="#" class="p-4 text-xl font-bold text-white bg-black">
            Codaborator
          </a>
        </div>
        <div class="flex flex-col justify-center px-8 pt-8 my-auto md:justify-start md:pt-0 md:px-24 lg:px-32">
          <p class="text-3xl text-center">Welcome.</p>
          <form class="flex flex-col pt-3 md:pt-8">
            <div class="flex flex-col pt-4">
              <div class="flex relative ">
                <span class=" inline-flex  items-center px-3 border-t bg-white border-l border-b  border-gray-300 text-gray-500 shadow-sm text-sm">
                  <svg
                    width="15"
                    height="15"
                    fill="currentColor"
                    viewBox="0 0 1792 1792"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M1792 710v794q0 66-47 113t-113 47h-1472q-66 0-113-47t-47-113v-794q44 49 101 87 362 246 497 345 57 42 92.5 65.5t94.5 48 110 24.5h2q51 0 110-24.5t94.5-48 92.5-65.5q170-123 498-345 57-39 100-87zm0-294q0 79-49 151t-122 123q-376 261-468 325-10 7-42.5 30.5t-54 38-52 32.5-57.5 27-50 9h-2q-23 0-50-9t-57.5-27-52-32.5-54-38-42.5-30.5q-91-64-262-182.5t-205-142.5q-62-42-117-115.5t-55-136.5q0-78 41.5-130t118.5-52h1472q65 0 112.5 47t47.5 113z"></path>
                  </svg>
                </span>
                <input
                  type="text"
                  id="userName"
                  class=" flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="Username"
                  value={userName}
                  onChange={(e) => {
                    setUserName(e.target.value);
                  }}
                  //If we press enter then also execute join room
                  onKeyUp={handleInputEnter}
                />
              </div>
            </div>
            <div class="flex flex-col pt-4 mb-12">
              <div class="flex relative ">
                <span class=" inline-flex  items-center px-3 border-t bg-white border-l border-b  border-gray-300 text-gray-500 shadow-sm text-sm">
                  <svg
                    width="15"
                    height="15"
                    fill="currentColor"
                    viewBox="0 0 1792 1792"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M1376 768q40 0 68 28t28 68v576q0 40-28 68t-68 28h-960q-40 0-68-28t-28-68v-576q0-40 28-68t68-28h32v-320q0-185 131.5-316.5t316.5-131.5 316.5 131.5 131.5 316.5q0 26-19 45t-45 19h-64q-26 0-45-19t-19-45q0-106-75-181t-181-75-181 75-75 181v320h736z"></path>
                  </svg>
                </span>
                <input
                  type="text"
                  id="roomID"
                  class=" flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="Room ID"
                  value={roomId}
                  onChange={(e) => {
                    setRoomId(e.target.value);
                  }}
                  onKeyUp={handleInputEnter} //If we press enter then also execute join room
                />
              </div>
            </div>
            <button
              type="submit"
              class="w-full px-4 py-2 text-base font-semibold text-center text-white transition duration-200 ease-in bg-black shadow-md hover:text-black hover:bg-white focus:outline-none focus:ring-2"
              onClick={joinRoom}
            >
              <span class="w-full">Join</span>
            </button>
          </form>
          <div class="pt-12 pb-12 text-center">
            <p>
              Don&#x27;t have a Room Id ? &nbsp;
              <a
                onClick={createNewRoom}
                href="#"
                class="font-semibold underline"
              >
                Create Room
              </a>
            </p>
          </div>
        </div>
      </div>
      <div class="w-1/2 shadow-2xl">
        <img
          class="hidden object-cover w-full h-screen md:block"
          src="/src/assets/logo.png"
        />
      </div>
    </div>
  );
}

export default Home;
