/**
 * New node file
 */
var fs = require('fs');
var PDFParser = require("pdf2json");
var mysql = require("./mysql.js");
var pdfMake = require("pdfmake");

function careTakerShowDocument(req,res){
	
		console.log(req.body.documentName);
		res.header("Access-Control-Allow-Origin", "*");
		var pdfParser = new PDFParser(this,1);
		pdfParser.on("pdfParser_dataError", function(errData){
			console.error(errData.parserError);
		});
		pdfParser.on("pdfParser_dataReady", function(pdfData){
			fs.writeFile("./content.txt", pdfParser.getRawTextContent());
		});
		pdfParser.loadPDF("./common/"+req.body.documentName);
		res.sendfile('content.txt');
	
}


function careTakerHomePage(req,res){
	
	res.header("Access-Control-Allow-Origin", "*");
	var sqlquery="select * from documentpending where caretaker_email=";
	sqlquery+= "'"+req.body.email+"'";
	sqlquery+= ";";
		
	mysql.fetchData(sqlquery,function(err,rows){
		if(rows.length > 0){
			var result={"status":"200","rows":rows};
			res.send(result);
		}else{
			var result={"status":"400"};
			res.send(result);
		}
	});
	
	
}


function nitesh(req,res){
	console.log("nitesh wadhwa");
	res.header("Access-Control-Allow-Origin", "*");
	var pdf = req.body.dataImg;
	console.log(pdf);
	pdf = pdf.replace('data:image/png;base64,', '');
	console.log(pdf);
	fs.writeFile("xyz.pdf",pdf, 'base64', function(err) { 
						console.log(err); 
			}); 
}
	
function deleteFromTable(req,res){
	
	res.header("Access-Control-Allow-Origin", "*");
	var sqlquery="delete from documentpending where caretaker_email=";
	sqlquery+= "'"+req.body.email+"'";
	sqlquery+= "and documentName=";
	sqlquery+= "'"+req.body.documentName+"'";
	sqlquery+= ";";
		
	console.log(sqlquery);
	
	mysql.fetchData(sqlquery,function(err,rows){
		var sqlquery1="select * from documentpending where caretaker_email=";
		sqlquery1+= "'"+req.body.email+"'";
		sqlquery1+= ";";
			
		mysql.fetchData(sqlquery1,function(err,rows){
			if(rows.length > 0){
				var result={"status":"200","rows":rows};
				res.send(result);
			}else{
				var result={"status":"400"};
				res.send(result);
			}
		});
	});
	
	
	
}


exports.deleteFromTable=deleteFromTable;
exports.nitesh=nitesh;
exports.careTakerHomePage=careTakerHomePage;
exports.careTakerShowDocument=careTakerShowDocument;