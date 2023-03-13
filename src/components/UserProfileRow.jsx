import React from "react";

const UserProfileRow = ({ user }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex items-center justify-center w-32 h-32 rounded-full bg-gray-100">
        <img
          className="object-cover w-32 h-32 rounded-full"
          src={user.avatar_url}
          alt={`${user.first_name}'s avatar`}
        />
      </div>
      <div className="mt-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          {user.name}
        </h2>
        <p className="text-sm font-medium text-gray-600">
          {user.email}
        </p>
      </div>
    </div>
  );
}