function tagfaces(args){

  var Jimp = require("jimp");
  var fs = require("fs");

  var dimensions = args.dimensions;
  var faces = args.faces;
  var images = args.images;

  return new Promise(function(resolve, reject) {
    Jimp.loadFont(Jimp.FONT_SANS_16_BLACK).then(function (font) {
      new Jimp(dimensions.width, dimensions.height, 0xD3D3D3, function (err, white_img) {
        for(var i=0; i<faces.length; i++){
          for(var k=0; k<images.length; k++){
            if (images[k].image.indexOf(faces[i].name) != -1 && images[k].faces.length == 1 && "identity" in images[k].faces[0]){
              face = faces[i];
              face_name = images[k].faces[0].identity.name;
              bitmap_face = new Buffer(face.data, 'base64');
              Jimp.read(bitmap_face, function (err, img) {
       	        white_img.composite(img, face.location.left, face.location.top);
      	        white_img.print(font, face.location.left, face.location.top + img.bitmap.height, face_name);
                if(white_img != null && i == faces.length - 1 && k == images.length - 1){
                  white_img.getBuffer(Jimp.MIME_JPEG, function (err, img_buffer) {  
                    resolve({tagged_faces: img_buffer.toString("base64")});
                  });
                }
              });
            }
          }
        } 
      });
    });
  })
}
exports.main = tagfaces
