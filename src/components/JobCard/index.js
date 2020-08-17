import React from 'react';
import './index.css'

export default function JobCard({ job: { name, location, jobId, date, time, countJob } }) {
    return (
        <div className="job-card">
            <div className="job-card__title">
                <p>{name}</p>
                <p>({jobId})</p>
            </div>
            <p>{location}</p>
            <div className="job-card__footer">
                <div className="job-card__time">
                    <p>{date}</p>
                    <p>{time}</p>
                </div>
                {countJob > 0 && <div className="job-card__number-of-job">{countJob}</div>}
            </div>
        </div>
    )
}