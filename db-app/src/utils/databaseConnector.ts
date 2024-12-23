import { Client, ClientOptions } from "@opensearch-project/opensearch";


const getOpensearchClient = (): Client => {
  const osClient = new Client({
    ssl: {
        rejectUnauthorized: false
    },
    node: "https://opensearch:9200",
    auth: {
        username: 'admin',
        password: 'admin'
    }
  });

  return osClient
};

const databaseClient = getOpensearchClient();

export default databaseClient;