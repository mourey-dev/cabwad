import React, { useState } from "react";
import axios from "axios";

interface ChangePasswordProps {
  isOpen: boolean;
  onClose: () => void;
  employeeId: string;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({
  isOpen,
  onClose,
  employeeId,
}) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    try {
      await axios.post(
        `https://your-api.com/employees/${employeeId}/change-password`,
        {
          oldPassword,
          newPassword,
        },
      );

      setSuccess("Password changed successfully!");
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError("Failed to change password. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="bg-opacity-50 fixed inset-0 flex items-center justify-center bg-gray-900/70">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-center text-2xl font-bold text-gray-700">
          Change Password
        </h2>

        {error && <p className="mb-2 text-sm text-red-500">{error}</p>}
        {success && <p className="mb-2 text-sm text-green-500">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Old Password
            </label>
            <input
              type="password"
              className="mt-1 w-full rounded border p-2"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              className="mt-1 w-full rounded border p-2"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <input
              type="password"
              className="mt-1 w-full rounded border p-2"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="rounded bg-gray-400 px-4 py-2 text-white hover:bg-gray-500"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Change Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
