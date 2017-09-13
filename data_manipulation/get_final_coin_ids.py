#!/usr/bin/python
# -*- coding: utf-8 -*-

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
provenance_event_set = '//lido:eventSet[./lido:event/lido:eventType/lido:term[contains(text(), "Provenienz")]]'
coinsFile = open(os.path.dirname(__file__) + '../data/csv/final_coin_ids.csv', 'w')

coins = []
coin_specs = [
  {
    'key': 'id',
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
  tree = etree.parse(os.path.dirname(__file__)  + '../data/xml/' + fileName)
  coin_id = fileName[3:8]

  thumb_url = parseValue(tree, '//lido:resourceSet/lido:resourceRepresentation[@lido:type="image_thumb"]/lido:linkResource/text()')
  object_type = parseValue(tree, '//lido:objectWorkType/lido:term/text()')

  if thumb_url != "http://ww2.smb.museum/mk_edit/images/sperre300.jpg" and object_type == "Coin":
    print coin_id
    coins.append([coin_id])

coins.append(getKeys(coin_specs))


for fn in os.listdir(os.path.dirname(__file__)  + './../data/xml'):
  parseFile(fn)


print "Number of coins: " + str(len(coins))

print "Writing files"

writer = csv.writer(coinsFile)
writer.writerows(coins)
coinsFile.close()