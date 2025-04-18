import React, { useState, useEffect } from "react";
// import * as Dialog from "@headlessui/react";
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import {
  XMarkIcon,
  UserPlusIcon,
  UserMinusIcon,
} from "@heroicons/react/24/outline";
import { User, Team } from "../types";
import { teamsApi } from "../api/teams";
import { toast } from "react-hot-toast";

interface ManageTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: Team;
  organizationMembers: User[];
  onTeamUpdate: any;
}

const ManageTeamModal: React.FC<ManageTeamModalProps> = ({
  isOpen,
  onClose,
  team,
  organizationMembers,
  onTeamUpdate,
}) => {
  const [loading, setLoading] = useState(false);
  const [teamMembers, setTeamMembers] = useState<User[]>([]);
  const [availableMembers, setAvailableMembers] = useState<User[]>([]);

  useEffect(() => {
    if (isOpen) {
      // Filter organization members into team members and available members
      const currentTeamMembers = organizationMembers.filter((member) =>
        member.teamIds?.includes(team._id)
      );
      const nonTeamMembers = organizationMembers.filter(
        (member) => !member.teamIds?.includes(team._id)
      );

      setTeamMembers(currentTeamMembers);
      setAvailableMembers(nonTeamMembers);
    }
  }, [isOpen, team._id, organizationMembers]);

  const handleAddMember = async (user: User) => {
    // console.log({ user });
    try {
      setLoading(true);
      await teamsApi.addTeamMember(team._id, user._id);
      await onTeamUpdate();
      toast.success(`Added ${user.firstName} ${user.lastName} to the team`);

      // Update local state
      setTeamMembers([...teamMembers, user]);
      setAvailableMembers(availableMembers.filter((m) => m._id !== user._id));
    } catch (error) {
      console.error("Error adding team member:", error);
      toast.error("Failed to add team member");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (user: User) => {
    try {
      setLoading(true);
      await teamsApi.removeTeamMember(team._id, user._id);
      await onTeamUpdate();
      toast.success(`Removed ${user.firstName} ${user.lastName} from the team`);

      // Update local state
      setTeamMembers(teamMembers.filter((m) => m._id !== user._id));
      setAvailableMembers([...availableMembers, user]);
    } catch (error) {
      console.error("Error removing team member:", error);
      toast.error("Failed to remove team member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-10 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen">
        <div
          className="fixed inset-0 bg-black/30 dark:bg-black/50"
          aria-hidden="true"
        />

        <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-2xl w-full mx-4">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-gray-700">
            <DialogTitle className="text-lg font-semibold text-neutral-900 dark:text-white">
              Manage Team Members - {team.name}
            </DialogTitle>
            <button
              onClick={onClose}
              className="text-neutral-500 dark:text-gray-400 hover:text-neutral-700 dark:hover:text-gray-300"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            {/* Current Members */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-neutral-700 dark:text-gray-200 mb-4">
                Current Members ({teamMembers.length})
              </h3>
              <div className="space-y-2">
                {teamMembers.map((member) => (
                  <div
                    key={member._id}
                    className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <div className="flex items-center min-w-0">
                      <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/50 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                          {member.firstName?.[0]}
                          {member.lastName?.[0]}
                        </span>
                      </div>
                      <div className="ml-3 min-w-0">
                        <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                          {member.firstName} {member.lastName}
                        </p>
                        <p className="text-sm text-neutral-500 dark:text-gray-400 truncate">
                          {member.email}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveMember(member)}
                      disabled={loading}
                      className="ml-4 p-2 text-neutral-500 dark:text-gray-400 hover:text-error-600 dark:hover:text-error-400 rounded-lg transition-colors"
                    >
                      <UserMinusIcon className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Available Members */}
            <div>
              <h3 className="text-sm font-medium text-neutral-700 dark:text-gray-200 mb-4">
                Available Members ({availableMembers.length})
              </h3>
              <div className="space-y-2">
                {availableMembers.map((member) => (
                  <div
                    key={member._id}
                    className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <div className="flex items-center min-w-0">
                      <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/50 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                          {member.firstName?.[0]}
                          {member.lastName?.[0]}
                        </span>
                      </div>
                      <div className="ml-3 min-w-0">
                        <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                          {member.firstName} {member.lastName}
                        </p>
                        <p className="text-sm text-neutral-500 dark:text-gray-400 truncate">
                          {member.email}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddMember(member)}
                      disabled={loading}
                      className="ml-4 p-2 text-neutral-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg transition-colors"
                    >
                      <UserPlusIcon className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end px-6 py-4 border-t border-neutral-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-gray-300 hover:bg-neutral-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default ManageTeamModal;
