import React, { useState, useEffect } from 'react';

import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import JobList from '../components/JobList';
import Content from '../components/Content';

import './QuestionThree.css'

export const QuestionThree = (props) => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    Promise.all([
      props.service.getJobs(),
      props.service.getJobAllocations()
    ]).then(responses => {
      const [jobs, jobAllocations] = responses;
      const jobList = jobs.map(({ id, name, location, start, end }) => {
        const jobId = `Job #${id}`;
        const { length } = jobAllocations.filter(({ jobId }) => jobId === id);
        return {
          jobId,
          name,
          location,
          date: (new Date(start)).toString().slice(0, 15),
          time: getTime(start, end),
          countJob: length
        }
      })
      setJobs(jobList);
    })
  }, [props.service]);

  function getTime(start, end) {
    return `${start.slice(11, 16)} - ${end.slice(11, 16)}`;
  }

  return (
    <div className="question-tree">
      <Sidebar />
      <div className="question-tree__right-side">
        <Header>
          <p className="question-tree__title">Header</p>
        </Header>
        <div className="question-tree__job-content">
          <JobList jobs={jobs} />
          <Content />
        </div>
      </div>
    </div>
  )
}