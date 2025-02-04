import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-text-light mb-6">Dashboard</h1>
      
      {/* Welcome Header */}
      <div className="bg-background p-4 rounded-lg mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl text-text-light">Welcome, User!</h2>
          <button className="bg-primary text-text-light px-4 py-2 rounded-lg">
            Create Content
          </button>
        </div>
      </div>

      {/* Content Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-background p-4 rounded-lg">
          <h3 className="text-xl text-text-light mb-4">Content Summary</h3>
          {/* Placeholder for content stats */}
          <div className="space-y-2 text-text-light">
            <p>Drafts: 5</p>
            <p>Approved: 10</p>
            <p>Scheduled: 3</p>
          </div>
        </div>
        
        <div className="bg-background p-4 rounded-lg">
          <h3 className="text-xl text-text-light mb-4">Quick Links</h3>
          <div className="space-x-4">
            <button className="bg-primary text-text-light px-4 py-2 rounded-lg">New Content</button>
            <button className="bg-primary text-text-light px-4 py-2 rounded-lg">View Library</button>
            <button className="bg-primary text-text-light px-4 py-2 rounded-lg">Analytics</button>
          </div>
        </div>
      </div>

      {/* Upcoming Schedule */}
      <div className="bg-background p-4 rounded-lg">
        <h3 className="text-xl text-text-light mb-4">Upcoming Schedule</h3>
        {/* Placeholder for calendar */}
        <div className="text-text-light">Calendar view will be implemented here</div>
      </div>
    </div>
  );
};

export default Dashboard;
