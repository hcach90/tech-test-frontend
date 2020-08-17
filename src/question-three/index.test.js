import React from "react";
import nock from 'nock';

import { render, cleanup } from "@testing-library/react";
import { DataService } from '../service/DataService';
import { QuestionThree } from "./QuestionThree";

const JOBS = [
    {
        "id": 0,
        "name": "Build a fence",
        "contactId": "0",
        "start": "2018-09-01T10:00:00Z",
        "end": "2018-09-01T11:00:00Z",
        "location": "Brisbane"
    },
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
    },
    {
        "id": 3,
        "name": "Pick up a trailer",
        "contactId": "0",
        "start": "2018-09-01T13:00:00Z",
        "end": "2018-09-01T13:15:00Z",
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

beforeAll(() => {
    nock('http://localhost:3400')
        .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
        .get('/jobs')
        .reply(200, JOBS)
        .get('/jobAllocations')
        .reply(200, JOB_ALLOCATIONS)
});

afterEach(cleanup);

describe('Integration test of QuestionThree', () => {
    it("Display list jobs", async () => {
        const LOCATION = 'Brisbane';
        const DATE = 'Sat Sep 01 2018';
        const { getByText, getAllByText, findByText, container } = render(<QuestionThree service={DataService} />);

        expect(await findByText(JOBS[0].name)).toBeInTheDocument();
        JOBS.forEach(({ id, name, start, end }) => {
            expect(getByText(`(Job #${id})`)).toBeInTheDocument();
            expect(getByText(name)).toBeInTheDocument();
            expect(getByText(`${start.slice(11, 16)} - ${end.slice(11, 16)}`)).toBeInTheDocument();
        });
        expect(getAllByText(LOCATION).length).toEqual(4);
        expect(getAllByText(DATE).length).toEqual(4);
        expect(container.getElementsByClassName('job-card__number-of-job').length).toEqual(2);
    });
});
