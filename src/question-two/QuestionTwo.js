import React, { useEffect, useState } from 'react';

import { SectionGroup } from '../components/section/SectionGroup'
import { SectionPanel } from '../components/section/SectionPanel'
import { Swimlane } from '../components/swimlane/Swimlane'

import './QuestionTwo.css';

/**
 * Please do not change these dates, the data on the server all fall within the 01/09/2018
 */
const RANGE_START = new Date('2018-09-01T00:00:00Z')
const RANGE_END = new Date('2018-09-01T24:00:00Z')

export const QuestionTwo = (props) => {
  const [lanes, setLanes] = useState([]);

  useEffect(() => {
    Promise.all([
      props.service.getResources(),
      props.service.getJobAllocations(),
      props.service.getActivityAllocations(),
      props.service.getJobs(),
      props.service.getActivities(),
    ]).then(responses => {
      const [resources, jobAllocations, activityAllocations, jobs, activities] = responses;
      const swimlaneData = [];

      const jobAllocationDetails = jobAllocations
        .map(({ jobId, ...jobAllocation }) => (
          {
            ...jobAllocation,
            ...jobs.find(({ id }) => id === jobId)
          }
        ));

      const activityAllocationDetails = activityAllocations
        .map(({ activityId, ...activityAllocation }) => (
          {
            ...activityAllocation,
            ...activities.find(({ id }) => id === activityId)
          }
        ));

      resources.forEach(({ id, name }) => {
        const lane = {
          title: name,
          cards: []
        }
        addToCard(lane.cards, jobAllocationDetails, id);
        addToCard(lane.cards, activityAllocationDetails, id);
        swimlaneData.push(lane);
      });

      setLanes(swimlaneData);
    })
  }, [props.service]);

  function addToCard(cards, list, id) {
    list.filter(({ resourceId }) => resourceId === id)
      .forEach(({ name, start, end }) => {
        cards.push({
          className: 'custom-card',
          description: name,
          start: new Date(start),
          end: new Date(end),
        });
      });
  }

  return (
    <SectionGroup>
      <SectionPanel>
        <Swimlane lanes={lanes} start={RANGE_START} end={RANGE_END} />
      </SectionPanel>
    </SectionGroup>
  )
}