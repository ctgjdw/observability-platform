import { opensearchtypes } from "@opensearch-project/opensearch";

import NumberFilter from "../interfaces/NumberFilter";
import Record from "../interfaces/Record";

interface RecordFilters {
  recordISOTimestampFrom: string; // recordISOTimeStamp
  recordISOTimestampTo: string; // recordISOTimeStamp
  engagementCount: NumberFilter; // recordLikeCount + recordShareCount + recordViewCount
}

interface RecordSortTypes {
  engagementCount: opensearchtypes.SearchSortOrder;
}

// STUB
const fetchRecordsByProfile = (
  profileId: string,
  filters: Partial<RecordFilters> = {},
  sort: Partial<RecordSortTypes> = {},
): Record[] => {
  console.log(filters); // temp to pass eslint
  console.log(sort); // temp to pass eslint
  // parse filters object
  // parse sort object
  // create opensearch query body and get result from es
  // clean response and send back
  return [];
};

export default { fetchRecordsByProfile };
