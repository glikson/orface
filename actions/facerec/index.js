function recognize(args){
  var fs = require("fs");
  var archiver = require('archiver');
  var watson = require('watson-developer-cloud');
  var JSZip = require("jszip");

  var zip = new JSZip();

  var faces = args.faces;
  var key = args.api_key;
  var version = args.api_version;
  var date = args.api_date;

  for (var i = 0; i < faces.length; i++){
    zip.file(faces[i].name + "." + faces[i].type, faces[i].data, {base64: true});
  }

  return new Promise(function(resolve, reject) {
    zip
      .generateNodeStream({type:'nodebuffer',streamFiles:true})
      .pipe(fs.createWriteStream('out.zip'))
      .on('finish', function () {
        console.log("out.zip written.");
        var visual_recognition = watson.visual_recognition({
          api_key: key,
          version: version,
          version_date: date
        });
        var params = {
          images_file: fs.createReadStream('out.zip')
        };
        console.log(params);
        visual_recognition.detectFaces(params,
          function(err, response) {
            if (err){
              reject(err);
            }else{
              result = JSON.parse(JSON.stringify(response, null, 2));
              result["dimensions"] = args.dimensions;
              result["faces"] = args.faces;
              resolve(result);
            }
          });
      });
  })
}
exports.main = recognize
