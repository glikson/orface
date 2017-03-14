function detect(args){
  var cv = require('/usr/local/lib/node_modules/opencv/lib/opencv');
  var classifier_path = require.resolve('/usr/local/lib/node_modules/opencv/data/haarcascade_frontalface_alt2.xml');

  var image = args.image;
  var image_type = args.type;
  var margin = parseFloat(args.margin);

  var bitmap = new Buffer(image, 'base64');

  return new Promise(function(resolve, reject) {

    cv.readImage(bitmap, function(err, im) {
      if (err) throw err;
      if (im.width() < 1 || im.height() < 1) throw new Error('Image has no size');  
      var faces = [];
      var result = {dimensions: {width: im.width(), height: im.height()}, faces}  
      im.detectObject(classifier_path, {}, function(err, detected_faces) {
        if (err) throw err;
        for (var i = 0; i < detected_faces.length; i++) {
          face = detected_faces[i];
          x_m = Math.round(margin * face.width);
          y_m = Math.round(margin * face.height);
          //TODO: take care of negative and rounding issues... 
          face_x = face.x - x_m;
          if(face_x<0) face_x=0;
          face_y = face.y - y_m;
          if(face_y<0) face_y=0;
          face_width = face.width + x_m * 2;
          face_height = face.height + y_m * 2; 
          cropped_face = im.crop(face_x, face_y, face_width, face_height);
          faces[i] = {name: "image" + i.toString(), type: image_type, data: cropped_face.toBuffer().toString("base64"), 
                  location: {left: face_x, top: face_y, width: face_width, height: face_height}};
        }
        if(faces.length > 0){
           resolve(result);
        }else{
           reject("Faces not detected!");
        }
      });
    });
  })
}
exports.main = detect
