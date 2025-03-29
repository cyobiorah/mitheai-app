import React, { useState, useEffect } from 'react';
import { ChevronDownIcon, UsersIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useAuth } from '../contexts/AuthContext';
import { User } from '../types';
import axiosInstance from '../api/axios';

const MemberSelector: React.FC = () => {
  const { user, organization } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [members, setMembers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      if (!user?.organizationId) return;
      
      try {
        setIsLoading(true);
        const response = await axiosInstance.get(`/users/organization/${user.organizationId}`);
        setMembers(response.data || []);
      } catch (err) {
        console.error('Error fetching members:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, [user?.organizationId]);

  if (!user?.organizationId) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="px-4">
        <div className="animate-pulse">
          <div className="h-4 bg-neutral-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-3 bg-neutral-200 dark:bg-gray-700 rounded w-1/2 mt-2"></div>
        </div>
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="px-4">
        <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Members</h3>
        <p className="text-xs text-gray-400 dark:text-gray-500">No members found</p>
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
          <span>Team Members</span>
        </div>
        <ChevronDownIcon
          className={clsx('h-5 w-5 text-gray-400 dark:text-gray-500 transition-transform', {
            'transform rotate-180': isOpen,
          })}
        />
      </button>

      {isOpen && (
        <div className="mt-2 py-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-64 overflow-y-auto">
          {members.map((member) => (
            <div
              key={member.uid}
              className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700/50"
            >
              <div className="flex items-center space-x-3 min-w-0">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-300 text-sm font-medium">
                    {member.firstName?.[0]}{member.lastName?.[0]}
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
                    {member.firstName} {member.lastName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {member.email}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MemberSelector;
