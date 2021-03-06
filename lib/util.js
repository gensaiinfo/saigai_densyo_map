'use strict'
const fs = require('fs');
const parse = require('csv-parse');

/**
 * CSV を JSONに変換するスクリプト
 */
const inputFile = __dirname + '/../data/saigai_densyo.csv'
const outputFile = __dirname+'/../docs/saigai_densyo.json'
fs.readFile(inputFile, function(error, data){
  if (error) console.log(error)

  const output = {}
  parse(data, {columns: true}, function(error, csv){
    if (error) console.log(error)

    csv.forEach(function(val){
      val['code6'] = ('0'+val['code6']).substr(-6)
      if(val['old_name']=='') {delete val['old_name'];}
      const vals = output[val['code6']]||[];
      vals.push(val);
      output[val['code6']] = vals
    })
    const json = JSON.stringify(output)
    fs.writeFileSync(outputFile, json)
  })
})
