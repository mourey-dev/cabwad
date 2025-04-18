import { jwtDecode } from "jwt-decode";
import { formatToMonthDayYear } from "./formatters";

interface JWTPayload {
  user_id: number;
  is_admin: boolean;
  is_superuser: boolean;
  exp: number;
}

const isValidDate = (dateStr: string) => {
  // Match either yy-mm-dd or yyyy-mm-dd
  const regex = /^(\d{2}|\d{4})-(\d{2})-(\d{2})$/;
  const match = dateStr.match(regex);
  if (!match) return false;

  let [_, yearStr, mmStr, ddStr] = match;
  let year = parseInt(yearStr);
  const month = parseInt(mmStr);
  const day = parseInt(ddStr);

  // Convert 2-digit year to 4-digit (assume 2000–2099)
  if (yearStr.length === 2) {
    year += 2000;
  }

  // Validate month and day ranges
  if (month < 1 || month > 12 || day < 1 || day > 31) return false;

  // Create date and validate real date
  const date = new Date(`${year}-${mmStr}-${ddStr}`);
  return (
    date.getFullYear() === year &&
    date.getMonth() + 1 === month &&
    date.getDate() === day
  );
};

export const validateAdminAccess = (): boolean => {
  try {
    const token = localStorage.getItem("access_token");

    if (!token) {
      return false;
    }

    const decoded = jwtDecode<JWTPayload>(token);

    // Check if token is expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTime) {
      return false;
    }

    // Check if user is admin or superuser
    return decoded.is_admin || decoded.is_superuser;
  } catch (error) {
    console.error("Error validating admin access:", error);
    return false;
  }
};

export const validateSuperAdminAccess = (): boolean => {
  try {
    const token = localStorage.getItem("access");

    if (!token) {
      return false;
    }

    const decoded = jwtDecode<JWTPayload>(token);
    // Check if token is expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTime) {
      return false;
    }

    // Check if user is specifically a superuser
    return decoded.is_superuser;
  } catch (error) {
    console.error("Error validating superadmin access:", error);
    return false;
  }
};

export const isAuthorizedAdmin = (): boolean => {
  const isLoggedIn = !!localStorage.getItem("access_token");
  const isAdmin = validateAdminAccess();

  return isLoggedIn && isAdmin;
};

export const isAuthorizedSuperAdmin = (): boolean => {
  const isLoggedIn = !!localStorage.getItem("access");
  const isSuperAdmin = validateSuperAdminAccess();

  return isLoggedIn && isSuperAdmin;
};

export const getValidDisplay = (
  value: string,
  defaultValue: string = "NONE",
) => {
  if (!value || value.trim().length === 0) {
    return defaultValue;
  }

  if (isValidDate(value)) {
    return formatToMonthDayYear(value);
  }

  return value;
};

export const getAge = (birthDate: string) => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

export const validatePassword = (
  oldPassword: string,
  newPassword: string,
  confirmPassword: string,
) => {
  if (!oldPassword || !newPassword || !confirmPassword) {
    return { error: true, message: "All fields are required." };
  }

  if (newPassword !== confirmPassword) {
    return { error: true, message: "Passwords do not match." };
  }

  if (newPassword.length < 8) {
    return {
      error: true,
      message: "Password must be at least 8 characters long.",
    };
  }

  if (oldPassword === newPassword) {
    return {
      error: true,
      message: "New password must be different from the old password.",
    };
  }

  return { error: false, message: "" };
};
