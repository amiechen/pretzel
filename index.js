var Xray = require('x-ray');
var x = Xray();
 
x('http://typeandpixel.com.au/', 'script', [{
  src: '@src',
  content: ''
}])
  .write('results.json')