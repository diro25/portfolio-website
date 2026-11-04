"use client";

import { useEffect, useState } from "react";

type Analytics = {
  totalViews: number;
  viewsToday: number;
  viewsThisMonth: number;
  topPages: { path: string; views: number }[];
  recentViews: { path: string; createdAt: string }[];
};

export default function AnalyticsPanel() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);

  useEffect(() => {
    fetch("/api/analytics").then((response) => response.json()).then(setAnalytics);
  }, []);

  if (!analytics) return <p>Loading analytics...</p>;

  return (
    <section className="admin-projects">
      <p className="eyebrow">VISITOR ANALYTICS</p>
      <h2>Understand your audience.</h2>
      <div className="analytics-stats">
        <div><strong>{analytics.totalViews}</strong><span>Total views</span></div>
        <div><strong>{analytics.viewsToday}</strong><span>Views today</span></div>
        <div><strong>{analytics.viewsThisMonth}</strong><span>This month</span></div>
      </div>
      <div className="analytics-columns">
        <div className="analytics-table">
          <h3>Popular pages</h3>
          {analytics.topPages.length === 0 ? <p>No views yet.</p> : analytics.topPages.map((page) => (
            <div className="analytics-row" key={page.path}><span>{page.path}</span><strong>{page.views}</strong></div>
          ))}
        </div>
        <div className="analytics-table">
          <h3>Recent activity</h3>
          {analytics.recentViews.length === 0 ? <p>No views yet.</p> : analytics.recentViews.map((view, index) => (
            <div className="analytics-row" key={`${view.createdAt}-${index}`}><span>{view.path}</span><small>{new Date(view.createdAt).toLocaleString()}</small></div>
          ))}
        </div>
      </div>
    </section>
  );
}
