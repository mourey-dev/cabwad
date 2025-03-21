import { jwtDecode } from "jwt-decode";

interface JWTPayload {
  user_id: number;
  is_admin: boolean;
  is_superuser: boolean;
  exp: number;
}

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
  return value.length === 0 ? defaultValue : value;
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
