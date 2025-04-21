import { User } from "../types";

// format role label
export function formatRoleLabel(role: string): string {
  return role
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Get user's initials for avatar
export const getInitials = (user: User | null) => {
  if (!user) return "?";
  return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
};
