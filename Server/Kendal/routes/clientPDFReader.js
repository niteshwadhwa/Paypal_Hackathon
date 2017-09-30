/**
 * New node file
 */
//var PdfReader = require("./PdfReader");

var fs = require('fs');
var PDFParser = require("pdf2json");


function processFile() {
	  var pdfParser = new PDFParser(this,1);
	  pdfParser.on("pdfParser_dataError", function(errData){
		  console.error(errData.parserError);
	  });
	  pdfParser.on("pdfParser_dataReady", function(pdfData){
	      fs.writeFile("./content.txt", pdfParser.getRawTextContent());
	  });
	  pdfParser.loadPDF("nitesh2.pdf");
	  return true;
}

function clientPDFReader(req,res){
	  console.log("nitesh");
	  res.header("Access-Control-Allow-Origin", "*");
	  
	
	      fs.readFile('temp.jpg', function(err, data) {
	          if (err){ throw err;}
	          var img = new Canvas.Image; // Create a new Image
	          img.src = data;

	          var canvas = new Canvas(img.width, img.height, 'pdf');
	          var ctx = canvas.getContext('2d');
	          ctx.drawImage(img, 0, 0, img.width / 4, img.height / 4);

	          res.writeHead(200, {'content-type' : 'application/pdf'});
	      res.write( canvas.toBuffer() );
	      res.end();  
	      });

}



exports.clientPDFReader=clientPDFReader;
