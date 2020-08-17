import React from 'react';
import JobCard from '../JobCard';
import './index.css'

export default function JobList({ jobs }) {
    return (
        <div className="job-list">
            {jobs.map(job => <JobCard key={job.jobId} job={job} />)}
        </div>
    )
}