import React from "react";

function Clients({username}) {
  return (
    <div>
      <li className="flex flex-row mb-2 border-gray-400 shadow-sm">
        <div className="shadow border select-none cursor-pointer bg-white  rounded-md flex flex-1 items-center p-4">
          <div className="flex flex-col items-center justify-center w-10 h-10 mr-4">
            <a href="#" className="relative block">
              <img
                alt="profil"
                src="\src\assets\profile.png"
                className="mx-auto object-cover rounded-full h-10 w-10 "
              />
            </a>
          </div>
          <div className="flex-1 pl-1 md:mr-16">
            <div className="text-sm text-gray-600 ">{username}</div>
          </div>
        </div>
      </li>
    </div>
  );
}

export default Clients;
