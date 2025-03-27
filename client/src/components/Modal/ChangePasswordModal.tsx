import React, { useState, useEffect } from "react";
import usePost from "../../hooks/usePost";
import { useStatus } from "../../context/StatusContext";
import Loading from "../Loading";

// Utils
import { validatePassword } from "../../utils/dataHandler";

interface ChangePasswordProps {
  isOpen: boolean;
  onClose: () => void;
}

// Define response type for password change
interface PasswordChangeResponse {
  status: string;
  detail: string;
}

// Define data type for password change request
interface PasswordChangeData {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ isOpen, onClose }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Password strength indicators
  const [passwordStrength, setPasswordStrength] = useState<
    "weak" | "medium" | "strong" | ""
  >("");
  const { status, setStatus } = useStatus();

  // Use your custom hook for API requests
  const {
    loading: isLoading,
    error: apiError,
    errorMessage: apiErrorMessage,
    response,
    handlePost,
  } = usePost<PasswordChangeResponse, PasswordChangeData>(
    "/account/change-password/",
  );

  // Reset form when modal is opened/closed
  useEffect(() => {
    if (isOpen) {
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordStrength("");
    }
  }, [isOpen]);

  // Handle API responses
  useEffect(() => {
    if (apiError) {
      const message = apiErrorMessage || "Failed to change password";
      setStatus({ ...status, error: true, message });
    }

    if (response) {
      const message = response.detail || "Password changed successfully!";
      setStatus({ ...status, success: true, message });

      onClose();
    }
  }, [apiError, response]);

  // Check password strength
  useEffect(() => {
    if (!newPassword) {
      setPasswordStrength("");
      return;
    }

    // Password strength criteria
    const hasUppercase = /[A-Z]/.test(newPassword);
    const hasLowercase = /[a-z]/.test(newPassword);
    const hasNumbers = /\d/.test(newPassword);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
      newPassword,
    );
    const isLongEnough = newPassword.length >= 8;

    const criteriaCount = [
      hasUppercase,
      hasLowercase,
      hasNumbers,
      hasSpecialChar,
      isLongEnough,
    ].filter(Boolean).length;

    if (criteriaCount <= 2) setPasswordStrength("weak");
    else if (criteriaCount <= 4) setPasswordStrength("medium");
    else setPasswordStrength("strong");
  }, [newPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error, message } = validatePassword(
      oldPassword,
      newPassword,
      confirmPassword,
    );

    if (error) {
      setStatus({ ...status, error, message });
    }

    handlePost({
      old_password: oldPassword,
      new_password: newPassword,
      confirm_password: confirmPassword,
    });
  };

  // Password strength indicator colors and messages
  const getStrengthColor = () => {
    switch (passwordStrength) {
      case "weak":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "strong":
        return "bg-green-500";
      default:
        return "bg-gray-200";
    }
  };

  const getStrengthMessage = () => {
    switch (passwordStrength) {
      case "weak":
        return "Password is too weak";
      case "medium":
        return "Password strength is moderate";
      case "strong":
        return "Password strength is good";
      default:
        return "";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/70">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        {isLoading && <Loading loading={true} />}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-700">Change Password</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Current Password
            </label>
            <input
              type="password"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              placeholder="Enter your current password"
              autoComplete="current-password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              placeholder="Enter your new password"
              autoComplete="new-password"
              minLength={8}
            />

            {/* Password strength meter */}
            {newPassword && (
              <>
                <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-gray-200">
                  <div
                    className={`h-full ${getStrengthColor()} ${passwordStrength && passwordStrength === "weak" ? "w-1/3" : passwordStrength === "medium" ? "w-2/3" : passwordStrength === "strong" ? "w-full" : ""}`}
                  ></div>
                </div>
                <p
                  className={`mt-1 text-xs ${
                    passwordStrength === "weak"
                      ? "text-red-600"
                      : passwordStrength === "medium"
                        ? "text-yellow-600"
                        : passwordStrength === "strong"
                          ? "text-green-600"
                          : ""
                  }`}
                >
                  {getStrengthMessage()}
                </p>
              </>
            )}

            <p className="mt-1 text-xs text-gray-500">
              Password must be at least 8 characters long
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <input
              type="password"
              className={`mt-1 w-full rounded-md border px-3 py-2 shadow-sm focus:ring-1 focus:outline-none ${
                confirmPassword && newPassword !== confirmPassword
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              }`}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm your new password"
              autoComplete="new-password"
            />
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="mt-1 text-xs text-red-600">
                Passwords do not match
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              className="rounded-md bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300 focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 focus:outline-none"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`rounded-md px-4 py-2 text-white focus:ring-2 focus:ring-offset-2 focus:outline-none ${
                isLoading
                  ? "cursor-not-allowed bg-blue-400"
                  : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
              }`}
              disabled={
                isLoading ||
                (!!confirmPassword && newPassword !== confirmPassword)
              }
            >
              {isLoading ? "Changing Password..." : "Change Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
