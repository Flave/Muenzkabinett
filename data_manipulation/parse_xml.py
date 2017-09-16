#!/usr/bin/python
# -*- coding: utf-8 -*-

# Extracts the specified attributes from lido formatted xml files and writes them into a csv

import os
import re
import csv
import sys
from lxml import etree

reload(sys)  
sys.setdefaultencoding('utf-8')

ns = {'lido': 'http://www.lido-schema.org', 'xml': 'someuri'}
production_event_set = '//lido:eventSet[./lido:event/lido:eventType/lido:term[contains(text(), "Herstellung")]]'
finding_event_set = '//lido:eventSet[./lido:event/lido:eventType/lido:term[contains(text(), "Fund")]]'

coinsCSVFile = open(os.path.dirname(__file__) + '../src/data/csv/coins_raw.csv', 'w')

coins = []
coin_specs = [
  # classification
  {
    'key': 'nominal',
    'path': '//lido:classificationWrap//lido:term[@lido:label="nominal"]/text()' # DE
  },
  {
    'key': 'division',
    'path': '//lido:objectClassificationWrap//lido:term[@lido:label="division"]/text()' # EN
  },
  {
    'key': 'subdivision',
    'path': '//lido:objectClassificationWrap//lido:term[@lido:label="subdivision"]/text()' # DE
  },
  # identification
  {
    'key': 'title',
    'path': '//lido:objectIdentificationWrap/lido:titleWrap//lido:appellationValue/text()' # DE
  },
  {
    'key': 'diameter',
    'path': '//lido:measurementType[contains(text(), "diameter")]/following-sibling::lido:measurementValue/text()'
  },
  {
    'key': 'weight',
    'path': '//lido:measurementType[contains(text(), "weight")]/following-sibling::lido:measurementValue/text()'
  },
  # production
  {
    'key': 'date_earliest',
    'path': production_event_set + '//lido:eventDate//lido:earliestDate/text()'
  },
  {
    'key': 'date_latest',
    'path': production_event_set + '//lido:eventDate//lido:latestDate/text()'
  },
  {
    'key': 'production_perion',
    'path': production_event_set + '//lido:periodName//lido:term/text()'
  },
  {
    'key': 'production_country',
    'path': production_event_set + '//lido:place[@lido:politicalEntity="country"]//lido:appellationValue[@xml:lang="en"]/text()'
  },
  {
    'key': 'production_region',
    'path': production_event_set + '//lido:place[@lido:politicalEntity="region"]//lido:appellationValue/text()'
  },
  {
    'key': 'production_minting_place',
    'path': production_event_set + '//lido:place[@lido:politicalEntity="minting_place"]//lido:appellationValue/text()'
  },
  {
    'key': 'production_material',
    'path': production_event_set + '//lido:termMaterialsTech[@lido:type="material"]//lido:term[@xml:lang="en"]/text()'
  },
  {
    'key': 'production_technique',
    'path': production_event_set + '//lido:termMaterialsTech[@lido:type="technique"]//lido:term[@xml:lang="en"]/text()'
  },
  # finding
  {
    'key': 'finding_country',
    'path': finding_event_set + '//lido:place[@lido:politicalEntity="country"]//lido:appellationValue[@xml:lang="en"]/text()'
  },
  {
    'key': 'finding_place',
    'path': finding_event_set + '//lido:place[@lido:politicalEntity="finding_place"]//lido:appellationValue/text()'
  },
  # image
  {
    'key': 'thumb_vs',
    'path': '//lido:resourceSet[@lido:sortorder="1"]//lido:linkResource/text()'
  }
]


# UTILITY FUNCTION

def getKeys(specs):
  keys = []
  for spec in specs:
    keys.append(spec['key'])
  return keys


def parseValue(tree, path, index=0):
  value = tree.xpath(path, namespaces=ns)
  if(len(value) > index):
    if re.match("^\-?\d+$", value[index]) is not None:
      return int(value[index])
    else:
      return value[index]
  else:
    return None


# PARSE FUNCTIONS

def parseFile(fileName):
  tree = etree.parse(os.path.dirname(__file__)  + '../src/data/xml/' + fileName)
  coin_id = fileName[3:8]

  # Get rid of weird long shaped coin thing
  if(coin_id == "08145"):
    print "Unwanted Coin"
    return

  print coin_id
  parseCoinData(tree, coin_id)


def parseCoinData(tree, coin_id):
  data = []

  # Only get objects of type coin and whether it has a public image
  thumb_url = parseValue(tree, '//lido:resourceSet/lido:resourceRepresentation[@lido:type="image_thumb"]/lido:linkResource/text()')
  object_type = parseValue(tree, '//lido:objectWorkType/lido:term/text()')
  if thumb_url == "http://ww2.smb.museum/mk_edit/images/sperre300.jpg" or object_type != "Coin":
    return None

  data.append(coin_id)

  for spec in coin_specs:
    if(spec['key'] == 'id'):
      data.append(coin_id)
    else:
      value = parseValue(tree, spec['path'])
      data.append(value)
  coins.append(data)


coin_keys = getKeys(coin_specs)
coin_keys.insert(0, 'id')
coins.append(coin_keys)


for fn in os.listdir(os.path.dirname(__file__)  + './../src/data/xml'):
  parseFile(fn)


writer = csv.writer(coinsCSVFile)
writer.writerows(coins)
coinsCSVFile.close()