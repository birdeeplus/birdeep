"use client";
import React from "react";

export default function DeleteConfirmationModal({ isOpen, onClose, onConfirm, recorderName }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-[400px] relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          &times;
        </button>
        <p className="text-center text-lg font-semibold mb-4">
          Are you sure you want to delete &quot;{recorderName}&quot;?
        </p>
        <div className="flex justify-center gap-4">
          <button
            className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800"
            onClick={onConfirm}
          >
            Accept
          </button>
          <button
            className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800"
            onClick={onClose}
          >
            ✖ Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
