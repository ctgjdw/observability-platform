import { opensearchtypes } from "@opensearch-project/opensearch";

// takes in the open search hits response, extracts the _source and _id then flattens it
const processOpensearchResponse = <T>(
  openSearchHitsResponse: Array<opensearchtypes.SearchHit<T>>,
): Array<{ id: string } & T> => {
  // flattens the _source given by the open search response
  const results = openSearchHitsResponse.map((result) => {
    const { _id: id, _source: source } = result;
    return {
      id,
      ...(source as T),
    };
  });

  return results;
};

export default { processOpensearchResponse };