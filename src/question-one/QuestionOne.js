import React, { useEffect, useState, useRef } from 'react';
import { fromEvent, of } from 'rxjs';
import { debounceTime, filter, switchMap, delay } from 'rxjs/operators';

import { SectionGroup } from '../components/section/SectionGroup'
import { SectionPanel } from '../components/section/SectionPanel'

import './QuestionOne.css'

const MIN_LENGTH = 2;

export const QuestionOne = (props) => {
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([]);
  const inputChange = useRef();

  useEffect(() => {
    fromEvent(inputChange.current, 'input')
      .pipe(
        debounceTime(1000),
        filter(e => {
          const { length } = e.target.value;
          return length > MIN_LENGTH || length === 0;
        }),
        switchMap(e => {
          const { length } = e.target.value;
          if (length > MIN_LENGTH) {
            setLoading(true);
            return of(e)
              .pipe(
                switchMap(e => props.service.getJobsWithSearchTerm(e.target.value)),
                delay(500)
              )
          }
          return of([]);
        }),
      )
      .subscribe(
        response => {
          setLoading(false);
          setJobs(response);
        },
        () => {
          setLoading(false);
          setJobs([]);
        }
      );
  }, [props.service]);

  function getListJob() {
    return jobs.map(({ id, name, start, end, contact }) =>
      <div key={id} className="job">
        <p>Name: {name}</p>
        <ul>
          <li>Start: {start}</li>
          <li>End: {end}</li>
          <li>Contact name: {contact.name}</li>
        </ul>
      </div>
    )
  }

  return (
    <SectionGroup>
      <SectionPanel>
        <input ref={inputChange} placeholder='Enter job name' autoFocus />
        {loading ? <p>Loading...</p> : getListJob()}
      </SectionPanel>
    </SectionGroup>
  )
}