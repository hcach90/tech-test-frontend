import React from "react";
import userEvent from '@testing-library/user-event';
import { render, cleanup } from "@testing-library/react";

import { DataService } from '../service/DataService';
import { QuestionOne } from "./QuestionOne";

const PLACE_HOLDER = 'Enter job name';
const TEXT_INPUT = 'build';
const LOADING = 'Loading...';
const JOBS = [
    {
        contact: { id: "0", name: "John Smith" },
        end: "2018-09-01T11:00:00Z",
        id: "0",
        name: "Job name",
        start: "2018-09-01T10:00:00Z",
    }
];

beforeAll(() => {
    jest.spyOn(DataService, "getJobsWithSearchTerm").mockImplementation(() => Promise.resolve(JOBS));
});

afterAll(() => {
    DataService.getJobsWithSearchTerm.mockRestore();
});

afterEach(cleanup);

describe('Integration test of QuestionOne', () => {
    it("Should not fetch jobs due to less than 3 characters", async () => {
        const { getByPlaceholderText, container } = render(<QuestionOne service={DataService} />);
        userEvent.type(getByPlaceholderText(PLACE_HOLDER), 'bu');
        expect(getByPlaceholderText(PLACE_HOLDER).value).toEqual('bu');
        expect(container).not.toHaveClass('job');
    });

    it("Filter jobs that having matching names", async () => {
        const { getByText, findByText, getByPlaceholderText } = render(<QuestionOne service={DataService} />);
        userEvent.type(getByPlaceholderText(PLACE_HOLDER), TEXT_INPUT);
        expect(getByPlaceholderText(PLACE_HOLDER).value).toEqual(TEXT_INPUT);

        expect(await findByText(LOADING)).toBeInTheDocument();
        expect(await findByText(`Name: ${JOBS[0].name}`)).toBeInTheDocument();

        expect(getByText(`Start: ${JOBS[0].start}`)).toBeInTheDocument();
        expect(getByText(`End: ${JOBS[0].end}`)).toBeInTheDocument();
        expect(getByText(`Contact name: ${JOBS[0].contact.name}`)).toBeInTheDocument();
    });
});
