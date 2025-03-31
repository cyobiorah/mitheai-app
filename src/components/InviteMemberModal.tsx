import React, { useState } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Team, User } from "../types";
import { usersApi } from "../api/users";
import { useAuth } from "../store/hooks";
import { toast } from "react-hot-toast";

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  teams: Team[];
}

const ROLES: { id: User["role"]; name: string }[] = [
  { id: "user", name: "User" },
  { id: "team_manager", name: "Team Manager" },
  { id: "org_owner", name: "Organization Owner" },
];

const InviteMemberModal: React.FC<InviteMemberModalProps> = ({
  isOpen,
  onClose,
  teams,
}) => {
  const { organization } = useAuth();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState<User["role"]>("user");
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organization) return;

    if (!email.trim() || !firstName.trim() || !lastName.trim()) {
      setError("All fields are required");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      await usersApi.inviteUser({
        email,
        firstName,
        lastName,
        role,
        organizationId: organization.id,
      });

      toast.success("Invitation sent successfully");

      // Reset form
      setEmail("");
      setFirstName("");
      setLastName("");
      setRole("user");
      setSelectedTeams([]);
      onClose();
    } catch (err) {
      console.error("Error inviting member:", err);
      toast.error("Failed to send invitation");
      setError("Failed to invite member");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div
        className="fixed inset-0 bg-black/30 dark:bg-black/50"
        aria-hidden="true"
      />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <DialogTitle className="text-lg font-semibold text-neutral-900 dark:text-white">
              Invite Team Member
            </DialogTitle>
            <button
              onClick={onClose}
              className="text-neutral-500 dark:text-gray-400 hover:text-neutral-700 dark:hover:text-gray-300"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-error/10 dark:bg-error/20 text-error dark:text-error-400 text-sm rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-neutral-700 dark:text-gray-200 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-neutral-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent placeholder-neutral-400 dark:placeholder-gray-400"
                placeholder="Enter email address"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-neutral-700 dark:text-gray-200 mb-1"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-neutral-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent placeholder-neutral-400 dark:placeholder-gray-400"
                  placeholder="First name"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-neutral-700 dark:text-gray-200 mb-1"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-neutral-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent placeholder-neutral-400 dark:placeholder-gray-400"
                  placeholder="Last name"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-neutral-700 dark:text-gray-200 mb-1"
              >
                Role
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as User["role"])}
                className="w-full px-3 py-2 border border-neutral-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-neutral-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
              >
                {ROLES.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-gray-200 mb-1">
                Teams
              </label>
              <div className="space-y-2">
                {teams.map((team) => (
                  <label
                    key={team._id}
                    className="flex items-center space-x-2 text-sm text-neutral-700 dark:text-gray-200"
                  >
                    <input
                      type="checkbox"
                      checked={selectedTeams.includes(team._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTeams([...selectedTeams, team._id]);
                        } else {
                          setSelectedTeams(
                            selectedTeams.filter((id) => id !== team._id)
                          );
                        }
                      }}
                      className="rounded border-neutral-300 dark:border-gray-600 text-primary-600 dark:text-primary-400 focus:ring-primary-500 dark:focus:ring-primary-400"
                    />
                    <span>{team.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-gray-300 hover:bg-neutral-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 rounded-lg transition-colors disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? "Sending Invitation..." : "Send Invitation"}
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default InviteMemberModal;
