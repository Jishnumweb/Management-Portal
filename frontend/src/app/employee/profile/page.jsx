"use client";

import { Camera, Edit } from "lucide-react";
import React from "react";

function Profile() {
  return (
    <div>
      <div className=" lg:p-0 p-3">
        {/* Header */}

        <div>
          <h1 className="lg:text-2xl text-xl font-semibold">My Profile</h1>
        </div>

        {/* Name  */}

        <div className="border p-5 mt-4 rounded-md">
          <div className="flex justify-between items-center">
            <div className="flex gap-3 items-center">
              <div className="">
                <img
                  src="https://www.pngmart.com/files/22/User-Avatar-Profile-PNG-Isolated-Transparent.png"
                  alt=""
                  className="h-14 w-full object-contain "
                />
              </div>
              <div>
                <h1 className="font-semibold text-xl">Jishnu M</h1>
                <p className="text-sm">Jr Developer</p>
              </div>
            </div>

            <div className="flex gap-2 bg-[#edecec] p-2 border rounded-sm">
              <div>
                <Camera />
              </div>
              <div>
                <h1>Update Photo</h1>
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="border p-5 mt-4">
          <div className="space-y-5">
            <div className="grid lg:grid-cols-2 gap-3">
              <div>
                <p className="text-sm mb-1">EMPLOYEE ID</p>
                <p className="p-3 border rounded-md bg-[#f0f0f0]">VA-004</p>
              </div>
              <div>
                <p className="text-sm mb-1">EMAIL</p>
                <p className="p-3 border rounded-md bg-[#f0f0f0]">
                  jishnum.me@gmail.com
                </p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-3">
              <div>
                <p className="text-sm mb-1">PHONE</p>
                <p className="p-3 border rounded-md bg-[#f0f0f0]">9778732718</p>
              </div>
              <div>
                <p className="text-sm mb-1">DEPARTMENT</p>
                <p className="p-3 border rounded-md bg-[#f0f0f0]">
                  Development
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm mb-1">JOIN DATE</p>
                <p className="p-3 border rounded-md bg-[#f0f0f0]">11-04-2025</p>
              </div>
              <div>
                <p className="text-sm mb-1">SALARY</p>
                <p className="p-3 border rounded-md bg-[#f0f0f0]">0</p>
              </div>
            </div>

            <div>
              <div>
                <p className="text-sm mb-1">ADDRESS</p>
                <p className="p-3 py-6 border rounded-md bg-[#f0f0f0]">
                  ABC Building ,Newyork
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
