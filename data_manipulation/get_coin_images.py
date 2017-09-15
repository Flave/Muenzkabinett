# Takes a csv file with thumb urls and gets all the high res coin images and saves them with transparent backgrounds

import urllib
import os
from lxml import etree
import re
from PIL import Image
import cStringIO
import sys
import csv

coins = csv.reader(open(os.path.dirname(__file__) + '../src/data/csv_new/coins_raw.csv'), delimiter=",")
keys = coins.next()
coins = list(coins)

output_height = 300

start_index = int(sys.argv[1])
if len(sys.argv) > 2:
  end_index = int(sys.argv[2])
else:
  end_index = None


def make_white_transparent(img):
  datas = img.getdata()
  threshold = 245
  new_data = []
  for item in datas:
      if item[0] >= threshold and item[1] >= threshold and item[2] >= threshold:
          new_data.append((255, 255, 255, 0))
      else:
          new_data.append(item)
  new_image = Image.new(img.mode, img.size)
  new_image.putdata(new_data)
  return new_image


def calculate_image_width(img, height):
  original_width, original_height = img.size
  return original_width * height / original_height


for i, coin in enumerate(coins[start_index:end_index]):
  thumb_url_front = coin[len(coin) - 1]
  image_id = re.search(r'\/(\w\d+\/\d+)\/', thumb_url_front)


  if image_id:
    print i, coin[0]
    
    if image_id.group(1) == "1629":
      continue

    # vs_exp/vs_opt/rs_exp/rs_opt
    image_id = image_id.group(1)
    large_url = "http://ikmk.smb.museum/mk-edit/images/" + image_id + "/vs_opt.jpg"

    print large_url

    image_file = cStringIO.StringIO(urllib.urlopen(large_url).read())
    img = Image.open(image_file)
    img = img.convert("RGBA")
    img_transparent = make_white_transparent(img)
    img_resized = img_transparent.resize((calculate_image_width(img_transparent, output_height), output_height), Image.ANTIALIAS)

    img_transparent.save('../src/data/images/front/' + coin[0] + '.png', "PNG")

  else:
    continue