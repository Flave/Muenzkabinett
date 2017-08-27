export default [
  {
    key: 'title',
    value: 'Title',
    type: 'discrete',
    similarityWeight: 1,
    type: 'individual',
    selectable: false
  },
  {
    key: 'production_country',
    value: 'Country',
    type: 'discrete',
    similarityWeight: 0.3,
    selectable: true
  },
  {
    key: 'production_region',
    value: 'Region',
    type: 'discrete',
    similarityWeight: 0.6,
    selectable: true
  },
  {
    key: 'production_minting_place',
    value: 'Minting Place',
    type: 'discrete',
    similarityWeight: 0.8,
    selectable: true
  },
  {
    key: 'weight',
    value: 'Weight',
    type: 'continuous',
    similarityWeight: 0.1,
    grouping: 10,
    selectable: true
  },
  {
    key: 'diameter',
    value: 'Diameter',
    type: 'continuous',
    similarityWeight: 0.1,
    grouping: 5,
    selectable: true
  },
  {
    key: 'production_material',
    value: 'Material',
    type: 'discrete',
    similarityWeight: 0.3,
    selectable: true
  },
  {
    key: 'nominal',
    value: 'Nominal',
    type: 'discrete',
    similarityWeight: 0.6,
    selectable: false,
  },
  {
    key: 'date_earliest',
    value: 'Earliest Date',
    type: 'continuous',
    similarityWeight: 0.1,
    grouping: 100,
    selectable: true
  },
  {
    key: 'date_latest',
    value: 'Last Date',
    type: 'continuous',
    similarityWeight: 0.1,
    grouping: 100,
    selectable: true
  }
]