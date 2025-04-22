import React, { useState, useEffect } from "react";
import {
  ChevronDownIcon,
  UsersIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useAuth } from "../store/hooks";
import { Team } from "../types";

const TeamSelector: React.FC = () => {
  const { user, teams } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  // Initialize selected team when teams are loaded
  useEffect(() => {
    if (teams && teams.length > 0 && !selectedTeam) {
      setSelectedTeam(teams[0]);
    }
  }, [teams, selectedTeam]);

  // If not an organization user or no teams, show nothing
  if (!user?.organizationId || !teams || teams.length === 0) {
    return null;
  }

  return (
    <div className="px-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">
          Teams
        </h3>
        <button
          className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
          onClick={() => {
            /* Handle team creation */
          }}
        >
          <PlusIcon className="h-3 w-3 inline mr-1" />
          Add
        </button>
      </div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50"
      >
        <div className="flex items-center">
          <UsersIcon className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-2" />
          <span>{selectedTeam?.name || "Select Team"}</span>
        </div>
        <ChevronDownIcon
          className={clsx(
            "h-5 w-5 text-gray-400 dark:text-gray-500 transition-transform",
            {
              "transform rotate-180": isOpen,
            }
          )}
        />
      </button>

      {isOpen && (
        <div className="mt-2 py-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          {teams.map((team) => (
            <button
              key={team.id}
              onClick={() => {
                setSelectedTeam(team);
                setIsOpen(false);
                // Here you would typically update the active team in your context
              }}
              className={clsx(
                "w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50",
                selectedTeam?.id === team.id
                  ? "bg-primary-50 dark:bg-primary-900/50 text-primary-600 dark:text-primary-300"
                  : "text-gray-700 dark:text-gray-200"
              )}
            >
              <div className="flex items-center">
                <UsersIcon className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500" />
                {team.name}
                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                  ({team.memberIds?.length || 0} members)
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamSelector;
