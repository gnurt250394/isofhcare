module.exports = {
    DRUG_HISTORY: 1,
    FACILITY_HISTORY: 2,
    LOCATION_HISTORY: 3,
    schemaVersion:2,
    SearchHistory:
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
    },
    DataString:
    {
        name: "DataString",
        primaryKey: "key",
        properties: {
            key: 'string',
            value: 'string'
        }
    }
}