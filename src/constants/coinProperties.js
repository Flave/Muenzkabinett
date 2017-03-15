export default [
  {
    key: 'title',
    value: 'Title',
    type: 'discrete',
    similarityWeight: 1,
    type: 'individual'
  },
  {
    key: 'production_country',
    value: 'Country',
    type: 'discrete',
    similarityWeight: 0.3
  },
  {
    key: 'production_region',
    value: 'Region',
    type: 'discrete',
    similarityWeight: 0.6
  },
  {
    key: 'production_minting_place',
    value: 'Minting Place',
    type: 'discrete',
    similarityWeight: 0.8
  },
  {
    key: 'weight',
    value: 'Weight',
    type: 'continuous',
    similarityWeight: 0.1,
    grouping: 10
  },
  {
    key: 'diameter',
    value: 'Diameter',
    type: 'continuous',
    similarityWeight: 0.1,
    grouping: 5
  },
  {
    key: 'production_material',
    value: 'Material',
    type: 'discrete',
    similarityWeight: 0.3
  },
  {
    key: 'nominal',
    value: 'Nominal',
    type: 'discrete',
    similarityWeight: 0.6
  },
  {
    key: 'date_earliest',
    value: 'Earliest Date',
    type: 'continuous',
    similarityWeight: 0.1,
    grouping: 100
  },
  {
    key: 'date_latest',
    value: 'Last Date',
    type: 'continuous',
    similarityWeight: 0.1,
    grouping: 100
  }
]