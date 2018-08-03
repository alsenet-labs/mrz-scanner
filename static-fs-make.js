var fs=require('fs');
var storage={};
var list=require('./static-fs-list.json');
var path=require('path');

list.forEach(function(f){
  var srcPath=(f.baseDir)?path.join(f.baseDir,f.name):f.name;
  storage['/'+f.name]={
    encoding: f.encoding,
    data: fs.readFileSync(srcPath,f.encoding)
    //data: fs.readFileSync(f.name,f.encoding)
  }
});

fs.writeFileSync('./static-fs-data.json',JSON.stringify(storage));

