/* eslint-disable */
const fs = require('fs')
const obfuscator = require('javascript-obfuscator')

fs.readFile('../../../dist/ssr/www/js/vendor.c9fd0220.js', 'UTF-8', function (err, data) {
  if (err) {
    throw err
  }
  var result = obfuscator.obfuscate(data)

  fs.writeFile('../../../dist/ssr/www/js/vendor.c9fd0220-o.js', result.getObfuscatedCode(), function (err) {
    if (err) {
      return console.log(err)
    }

    console.log('Success')
  })
})
