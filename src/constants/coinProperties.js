export default [
  {
    key: 'title',
    label: 'Title',
    type: 'discrete',
    similarityWeight: 1,
    type: 'individual',
    selectable: false,
    unit: ''
  },
  {
    key: 'production_country',
    label: 'Country',
    type: 'discrete',
    similarityWeight: 0.3,
    selectable: true,
    unit: ''
  },
  {
    key: 'production_region',
    label: 'Region',
    type: 'discrete',
    similarityWeight: 0.6,
    selectable: true,
    unit: ''
  },
  {
    key: 'production_minting_place',
    label: 'Minting Place',
    type: 'discrete',
    similarityWeight: 0.8,
    selectable: true,
    unit: ''
  },
  {
    key: 'weight',
    label: 'Weight',
    type: 'continuous',
    similarityWeight: 0.1,
    grouping: 10,
    selectable: true,
    unit: 'g'
  },
  {
    key: 'diameter',
    label: 'Diameter',
    type: 'continuous',
    similarityWeight: 0.1,
    grouping: 5,
    selectable: true,
    unit: 'mm'
  },
  {
    key: 'production_material',
    label: 'Material',
    type: 'discrete',
    similarityWeight: 0.3,
    selectable: true,
    unit: ''
  },
  {
    key: 'nominal',
    label: 'Nominal',
    type: 'discrete',
    similarityWeight: 0.6,
    selectable: false,
    unit: ''
  },
  {
    key: 'date_earliest',
    label: 'Earliest Date',
    type: 'continuous',
    similarityWeight: 0.1,
    grouping: 100,
    selectable: true,
    unit: 'y'
  },
  {
    key: 'date_latest',
    label: 'Last Date',
    type: 'continuous',
    similarityWeight: 0.1,
    grouping: 100,
    selectable: true,
    unit: 'y'
  }
]