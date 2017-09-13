import csv
import os

sprite_atlas = csv.reader(open(os.path.dirname(__file__) + '../data/csv/coins_40.csv'), delimiter=",")
sprite_atlas_keys = sprite_atlas.next()
sprite_atlas = list(sprite_atlas)

xIndex = sprite_atlas_keys.index('x')
yIndex = sprite_atlas_keys.index('y')
widthIndex = sprite_atlas_keys.index('width')
heightIndex = sprite_atlas_keys.index('height')

coins_data = csv.reader(open(os.path.dirname(__file__) + '../data/csv/coins_extended.csv'), delimiter=",")
keys = coins_data.next()
coins_data = list(coins_data)

keys.append('x')
keys.append('y')
keys.append('width')
keys.append('height')

for i, coin_data in enumerate(coins_data):
  sprite_data = sprite_atlas[i]
  coin_data.append(sprite_data[xIndex])
  coin_data.append(sprite_data[yIndex])
  coin_data.append(sprite_data[widthIndex])
  coin_data.append(sprite_data[heightIndex])

coins_file = open(os.path.dirname(__file__) + '../data/csv/coins.csv', 'w')
coins_data.insert(0, keys)
writer = csv.writer(coins_file)
writer.writerows(coins_data)
coins_file.close()