import React from "react";
import nock from 'nock';

import { render, cleanup } from "@testing-library/react";
import { DataService } from '../service/DataService';
import { QuestionTwo } from "./QuestionTwo";

const RESOURCES = [
    {
        "id": 0,
        "name": "Sam Seaborn"
    },
    {
        "id": 1,
        "name": "Donna Moss"
    },
    {
        "id": 2,
        "name": "Toby Ziegler"
    }
];

const JOBS = [
    {
        "id": 1,
        "name": "Build a shed",
        "contactId": "1",
        "start": "2018-09-01T10:15:00Z",
        "end": "2018-09-01T11:00:00Z",
        "location": "Brisbane"
    },
    {
        "id": 2,
        "name": "Shield some wiring",
        "contactId": "0",
        "start": "2018-09-01T09:00:00Z",
        "end": "2018-09-01T13:00:00Z",
        "location": "Brisbane"
    }
];

const JOB_ALLOCATIONS = [
    {
        "id": 0,
        "resourceId": 1,
        "jobId": 1
    },
    {
        "id": 1,
        "resourceId": 0,
        "jobId": 2
    }
];

const ACTIVITIES = [
    {
        "id": 1,
        "name": "Meal Break",
        "start": "2018-09-01T12:15:00Z",
        "end": "2018-09-01T13:10:00Z"
    }
];

const ACTIVITY_ALLOCATIONS = [
    {
        "id": 0,
        "resourceId": 1,
        "activityId": 1
    },
    {
        "id": 1,
        "resourceId": 2,
        "activityId": 1
    }
];

beforeAll(() => {
    nock('http://localhost:3400')
        .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
        .get('/resources')
        .reply(200, RESOURCES)
        .get('/jobs')
        .reply(200, JOBS)
        .get('/jobAllocations')
        .reply(200, JOB_ALLOCATIONS)
        .get('/activities')
        .reply(200, ACTIVITIES)
        .get('/activityAllocations')
        .reply(200, ACTIVITY_ALLOCATIONS)
});

afterEach(cleanup);

describe('Integration test of QuestionTwo', () => {
    it("Display event of people in form of timeline", async () => {
        const { getByText, getAllByText, findByText } = render(<QuestionTwo service={DataService} />);

        expect(await findByText(RESOURCES[0].name)).toBeInTheDocument();
        RESOURCES.forEach(({ name }) => expect(getByText(name)).toBeInTheDocument());
        JOBS.forEach(({ name }) => expect(getByText(name)).toBeInTheDocument());
        expect(getAllByText(ACTIVITIES[0].name).length).toEqual(2);
    });
});
