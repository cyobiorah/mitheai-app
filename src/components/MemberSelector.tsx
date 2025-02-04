import React, { useState, useEffect } from 'react';
import { ChevronDownIcon, UsersIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { User } from '../types';

const MemberSelector: React.FC = () => {
  const { organization } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [members, setMembers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      if (!organization) return;
      
      try {
        setIsLoading(true);
        const membersRef = collection(db, 'users');
        const q = query(membersRef, where('organizationId', '==', organization.id));
        const querySnapshot = await getDocs(q);
        const membersList = querySnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as any));
        setMembers(membersList);
      } catch (err) {
        console.error('Error fetching members:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, [organization]);

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
