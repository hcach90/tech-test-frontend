import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';
import Axios from 'axios';

const graphClient = new ApolloClient({
  uri: 'http://localhost:3500/graphql'
});

const axiosClient = Axios.create({
  baseURL: 'http://localhost:3400'
})

export const DataService = {
  //
  //  SAMPLE GraphQL Call
  //
  getJobsWithSearchTerm: searchTerm => {
    return graphClient.query({
      query: gql`
      query ($searchTerm: String){
        jobs(name: $searchTerm) {
          id,
          name,
          start,
          end,
          contact {
            id
            name
          }
        }
      }
      `,
      variables: {
        searchTerm: searchTerm
      }
    })
      .then(result => result.data)
      .then(data => data.jobs)
  },

  getJobs: () => {
    return axiosClient.get('/jobs').then(({ data }) => data);
  },

  getResources: () => {
    return axiosClient.get('/resources').then(({ data }) => data);
  },

  getActivities: () => {
    return axiosClient.get('/activities').then(({ data }) => data);
  },

  getJobAllocations: () => {
    return axiosClient.get('/jobAllocations').then(({ data }) => data);
  },

  getActivityAllocations: () => {
    return axiosClient.get('/activityAllocations').then(({ data }) => data);
  },
}