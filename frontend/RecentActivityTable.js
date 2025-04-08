// RecentActivityTable.js
import React, { useEffect, useState } from 'react';
import './Dashboard.css'; // use same styling if needed

const RecentActivityTable = ({ email }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch(`/api/history/${email}`);
        const data = await response.json();
        setActivities(data);
      } catch (error) {
        console.error('Error fetching activity history:', error);
      } finally {
        setLoading(false);
      }
    };

    if (email) {
      fetchActivities();
    }
  }, [email]);

  if (loading) {
    return <p>Loading recent activities...</p>;
  }

  return (
    <section className="recent-activity">
      <h3>Recent Activity</h3>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Analysis Type</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {activities.length > 0 ? (
            activities.map((activity) => (
              <tr key={activity._id}>
                <td>{new Date(activity.downloadedAt).toLocaleDateString()}</td>
                <td>{activity.pdfFile ? 'Report Generation' : 'Image Segmentation'}</td>
                <td>{activity.pdfFile ? 'Completed' : 'Processing'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No recent activities found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
};

export default RecentActivityTable;
