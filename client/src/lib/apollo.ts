import { ApolloClient, InMemoryCache } from '@apollo/client/core';

const apolloClient = new ApolloClient({
  uri: "http://localhost:4000/",
  cache: new InMemoryCache()
});

export default apolloClient;
