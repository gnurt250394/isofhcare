const SearchHistory =
{
    name: 'SearchHistory',
    primaryKey: 'id',
    properties: {
        id: 'string',
        dataId: 'string',
        type: 'int',
        name: 'string',
        timeSearch: 'double',
        data: 'string?',
        userId: 'string?'
    }
}
const DataString =
{
    name: "DataString",
    primaryKey: "key",
    properties: {
        key: 'string',
        value: 'string'
    }
}
const Specialist =
{
    name: "Specialist",
    primaryKey: "id",
    properties: {
        id: 'string',
        name: 'string',
        nameSearch: 'string',
        data: 'string'
    }
}
module.exports = {
    DRUG_HISTORY: 1,
    FACILITY_HISTORY: 2,
    LOCATION_HISTORY: 3,
    USER_EHEALTH_HISTORY: 5,
    schemaVersion: 4,
    SearchHistory,
    DataString,
    Specialist,
    Schemas: [SearchHistory, DataString, Specialist]
}