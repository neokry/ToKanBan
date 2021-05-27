import { GraphQLClient } from "graphql-request"; // GraphQL request client

let url = "https://api.thegraph.com/subgraphs/name/neokry/tokanban";

// Create client
const client = new GraphQLClient(url);

// Export client
export default client;
