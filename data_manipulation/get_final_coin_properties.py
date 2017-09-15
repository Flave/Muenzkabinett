import csv
import os

final_keys = [
  'id', 
  'title', 
  'division', 
  'subdivision', 
  'diameter', 
  'weight', 
  'date_earliest', 
  'date_latest', 
  'production_country', 
  'production_region', 
  'production_minting_place', 
  'production_material', 
  'production_technique', 
  'finding_country'
]

sprite_atlas = csv.reader(open(os.path.dirname(__file__) + '../src/data/csv/coins_positions.csv'), delimiter=",")
sprite_atlas_keys = sprite_atlas.next()
sprite_atlas = list(sprite_atlas)

coins_data = [];
coins_data_raw = csv.reader(open(os.path.dirname(__file__) + '../src/data/csv/coins_raw.csv'), delimiter=",")
keys = coins_data_raw.next()
coins_data_raw = list(coins_data_raw)

xIndex = sprite_atlas_keys.index('x')
yIndex = sprite_atlas_keys.index('y')
widthIndex = sprite_atlas_keys.index('width')

for i, coin_data_raw in enumerate(coins_data_raw):
  sprite_data = sprite_atlas[i]
  coin_data = []
  # go through final_keys and get corresponding data
  for j, key in enumerate(final_keys):
    keyIndex = keys.index(key)
    coin_data.append(coin_data_raw[keyIndex])

  # append position data to coin data
  coin_data.append(sprite_data[xIndex])
  coin_data.append(sprite_data[yIndex])
  coin_data.append(sprite_data[widthIndex])

  # append coin to coins
  coins_data.append(coin_data)

final_keys.append('x')
final_keys.append('y')
final_keys.append('width')

coins_file = open(os.path.dirname(__file__) + '../src/data/csv/coins.csv', 'w')
coins_data.insert(0, final_keys)
writer = csv.writer(coins_file)
writer.writerows(coins_data)
coins_file.close()