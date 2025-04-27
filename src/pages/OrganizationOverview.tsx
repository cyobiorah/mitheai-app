import React, { useState, useEffect } from "react";
import {
  UsersIcon,
  UserGroupIcon,
  DocumentTextIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

import { teamsApi } from "../api/teams";

import AddTeamModal from "../components/AddTeamModal";
import InviteMemberModal from "../components/InviteMemberModal";
import StatsCard from "../components/StatsCard";
import { User, Team } from "../types";
import { useAuth } from "../store/hooks";
import { usersApi } from "../api/users";
import { invitationsApi } from "../api/invitations";
import { ChartBarIcon } from "@heroicons/react/16/solid";
import SectionLoader from "../components/SectionLoader";
import ManageTeamModal from "../components/ManageTeamModal";

const OrganizationOverview: React.FC = () => {
  const { user, organization, isAdmin, teams, fetchTeams } = useAuth();
  const [isAddTeamModalOpen, setIsAddTeamModalOpen] = useState(false);
  const [isInviteMemberModalOpen, setIsInviteMemberModalOpen] = useState(false);
  const [isManageTeamModalOpen, setIsManageTeamModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [isMembersLoading, setIsMembersLoading] = useState(true);

  const fetchMembers = async () => {
    try {
      setIsMembersLoading(true);
      const orgDetails = await usersApi.getUsers(user?.organizationId!);
      setMembers(orgDetails.members);
    } catch (err) {
      console.error("Error fetching members:", err);
      toast.error("Failed to fetch members");
    } finally {
      setIsMembersLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
    fetchTeams();
  }, [user?.organizationId]);

  // console.log({ teams });

  const handleCreateTeam = async (name: string) => {
    if (!user?.organizationId) return;

    setIsLoading(true);
    setError(null);

    try {
      await teamsApi.createTeam(name, user.organizationId);
      setIsAddTeamModalOpen(false);
      toast.success("Team created successfully");
    } catch (err) {
      setError("Failed to create team");
      console.error("Error creating team:", err);
      toast.error("Failed to create team");
    } finally {
      fetchTeams();
      fetchMembers();
      setIsLoading(false);
    }
  };

  const handleDeleteTeam = async (teamId: string) => {
    if (!window.confirm("Are you sure you want to delete this team?")) return;

    setIsLoading(true);
    setError(null);

    try {
      await teamsApi.deleteTeam(teamId);
      toast.success("Team deleted successfully");
      fetchTeams();
    } catch (err) {
      setError("Failed to delete team");
      console.error("Error deleting team:", err);
      toast.error("Failed to delete team");
    } finally {
      fetchMembers();
      setIsLoading(false);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!window.confirm("Are you sure you want to remove this member?")) return;

    try {
      setIsLoading(true);
      await usersApi.deleteUser(userId);
      toast.success("Member removed successfully");
    } catch (err) {
      console.error("Error removing member:", err);
      toast.error("Failed to remove member");
    } finally {
      fetchMembers();
      setIsLoading(false);
    }
  };

  const handleResendInvitation = async (email: string) => {
    try {
      setIsLoading(true);
      await invitationsApi.resendInvitation(email);
      toast.success("Invitation resent successfully");
    } catch (err) {
      console.error("Error resending invitation:", err);
      toast.error("Failed to resend invitation");
    } finally {
      setIsLoading(false);
    }
  };

  if (!organization) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-8 bg-neutral-200 dark:bg-gray-700 rounded w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              className="h-32 bg-neutral-200 dark:bg-gray-700 rounded-xl"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  const getMembersClass = (member: User) => {
    if (member.status === "pending") {
      return "bg-warning-100 dark:bg-warning-900/50";
    }
    if (member.status === "active") {
      return "bg-success-100 dark:bg-success-900/50";
    }
    return "bg-neutral-100 dark:bg-gray-700";
  };

  const getIconClass = (member: User) => {
    if (member.status === "pending") {
      return "text-warning-700 dark:text-warning-400";
    }
    if (member.status === "active") {
      return "text-success-700 dark:text-success-400";
    }
    return "text-neutral-700 dark:text-gray-400";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Organization Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
            {organization?.name}
          </h1>
          <p className="mt-2 text-neutral-500 dark:text-gray-400 capitalize">
            {organization?.type} Plan
          </p>
        </div>
        {isAdmin && (
          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            Edit Organization
          </button>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        <StatsCard
          title="Total Members"
          value={members?.length ?? 0}
          icon={UsersIcon}
        />
        <StatsCard
          title="Active Teams"
          value={teams.length}
          icon={UserGroupIcon}
        />
        <StatsCard title="Total Content" value="--" icon={DocumentTextIcon} />
        <StatsCard title="Engagement Rate" value="--" icon={ChartBarIcon} />
      </div>

      {/* Teams Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm mt-8">
        {teams?.length > 0 && (
          <div className="px-6 py-4 border-b border-neutral-200 dark:border-gray-700 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Teams
            </h2>
            {isAdmin && (
              <button
                onClick={() => setIsAddTeamModalOpen(true)}
                className="flex items-center px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/50 rounded-lg transition-colors"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Add Team
              </button>
            )}
          </div>
        )}

        {error && (
          <div className="px-6 py-4 bg-error/10 dark:bg-error/20 border-b border-error/20 dark:border-error/30">
            <p className="text-sm text-error dark:text-error-400">{error}</p>
          </div>
        )}

        <div className="divide-y divide-neutral-200 dark:divide-gray-700">
          {teams.map((team) => (
            <div
              key={team._id}
              className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50"
            >
              <div className="flex items-center min-w-0">
                <div className="w-10 h-10 bg-primary-50 dark:bg-primary-900/50 rounded-lg flex items-center justify-center">
                  <UserGroupIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="ml-4 min-w-0">
                  <h3 className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                    {team.name}
                  </h3>
                  <p className="text-sm text-neutral-500 dark:text-gray-400 truncate">
                    {team.memberIds?.length || 0} members
                  </p>
                </div>
              </div>
              {isAdmin && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedTeam(team);
                      setIsManageTeamModalOpen(true);
                    }}
                    className="px-3 py-1.5 text-sm font-medium text-neutral-600 dark:text-gray-300 hover:bg-neutral-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    Manage
                  </button>
                  <button
                    onClick={() => handleDeleteTeam(team._id)}
                    className="p-1.5 text-neutral-400 dark:text-gray-500 hover:text-error-600 dark:hover:text-error-400 rounded-lg transition-colors"
                    disabled={isLoading}
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Members Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm mt-8">
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
            Members
          </h2>
          {isAdmin && (
            <button
              onClick={() => setIsInviteMemberModalOpen(true)}
              className="flex items-center px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/50 rounded-lg transition-colors"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Invite Member
            </button>
          )}
        </div>

        <div className="divide-y divide-neutral-200 dark:divide-gray-700">
          {isMembersLoading ? (
            <SectionLoader />
          ) : (
            members.map((member) => (
              <div
                key={member._id}
                className={`px-6 py-4 flex items-center justify-between ${
                  member.status === "pending" ? "bg-warning-50/50" : ""
                }`}
              >
                <div className="flex items-center min-w-0">
                  <div
                    className={`w-10 h-10 ${getMembersClass(
                      member
                    )} dark:bg-gray-700 rounded-lg flex items-center justify-center`}
                  >
                    <UsersIcon className={`w-6 h-6 ${getIconClass(member)}`} />
                  </div>
                  <div className="ml-4 min-w-0">
                    <h3 className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                      {member.firstName} {member.lastName}
                    </h3>
                    <p className="text-sm text-neutral-500 dark:text-gray-400">
                      {member.email}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-neutral-400 dark:text-gray-500 capitalize">
                        {member.role}
                      </p>
                      {member.status === "pending" && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-warning-100 dark:bg-warning-900/50 text-warning-800 dark:text-warning-400">
                          Pending Invitation
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {user?._id !== member._id && (
                  <div className="flex items-center gap-3">
                    {member.status === "pending" && (
                      <button
                        onClick={() => handleResendInvitation(member.email)}
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-warning-700 dark:text-warning-400 bg-warning-100 dark:bg-warning-900/50 hover:bg-warning-200 dark:hover:bg-warning-900/70 rounded-lg transition-colors"
                        disabled={isLoading}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4 mr-1.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                          />
                        </svg>
                        Resend
                      </button>
                    )}
                    {isAdmin && (
                      <button
                        onClick={() => handleRemoveMember(member._id)}
                        className="p-2 text-neutral-500 dark:text-gray-400 hover:text-error-600 dark:hover:text-error-400 rounded-lg transition-colors"
                        disabled={isLoading}
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modals */}
      <AddTeamModal
        isOpen={isAddTeamModalOpen}
        onClose={() => setIsAddTeamModalOpen(false)}
        onAdd={handleCreateTeam}
      />
      <InviteMemberModal
        isOpen={isInviteMemberModalOpen}
        onClose={() => setIsInviteMemberModalOpen(false)}
        teams={teams}
      />
      {selectedTeam && (
        <ManageTeamModal
          isOpen={isManageTeamModalOpen}
          onClose={() => {
            setIsManageTeamModalOpen(false);
            setSelectedTeam(null);
          }}
          team={selectedTeam}
          organizationMembers={members}
          // onTeamUpdate={() => teamsApi.getTeams(user!.organizationId!)}
          onTeamUpdate={() => teamsApi.getTeams(user!.organizationId!)}
        />
      )}
    </div>
  );
};

export default OrganizationOverview;
