module.exports = {
    DRUG_HISTORY: 1,
    FACILITY_HISTORY: 2,
    SearchHistory:
    {
        schemaVersion: 2,
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
}