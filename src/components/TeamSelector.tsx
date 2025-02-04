import React, { useState } from 'react';
import { ChevronDownIcon, UsersIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useAuth } from '../contexts/AuthContext';
import { Team } from '../types';

const TeamSelector: React.FC = () => {
  const { teams } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(teams[0] || null);

  if (teams.length === 0) {
    return (
      <div className="px-4">
        <div className="animate-pulse">
          <div className="h-4 bg-neutral-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-3 bg-neutral-200 dark:bg-gray-700 rounded w-1/2 mt-2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50"
      >
        <div className="flex items-center">
          <UsersIcon className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-2" />
          <span>{selectedTeam?.name || 'Select Team'}</span>
        </div>
        <ChevronDownIcon
          className={clsx('h-5 w-5 text-gray-400 dark:text-gray-500 transition-transform', {
            'transform rotate-180': isOpen,
          })}
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
              }}
              className={clsx(
                'w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50',
                selectedTeam?.id === team.id
                  ? 'text-primary-600 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/50'
                  : 'text-gray-700 dark:text-gray-200'
              )}
            >
              {team.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamSelector;
