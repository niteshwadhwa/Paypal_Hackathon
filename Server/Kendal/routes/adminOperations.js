/**
 * New node file
 */
var fs = require('fs');
var PDFParser = require("pdf2json");
var mysql = require("./mysql.js");

	
	function getCareTakerDetails(req,res){
	res.header("Access-Control-Allow-Origin", "*");
	var sqlquery="select g.guradian_name,c.caretaker_name,c.caretaker_email,c.caretaker_contact,c.caretaker_address from guardian_details g, caretaker_details c where c.caretaker_email ="
	sqlquery+= "'"+req.body.email+"'";
	sqlquery+= " and g.caretaker_email =";
	sqlquery+= "'"+req.body.email+"'";
	sqlquery+= ";";
		
	mysql.fetchData(sqlquery,function(err,rows){
		if(err){
			var result={"status":"400"};
			res.send(result);
		}else{
			if(rows.length == 1){
				console.log(rows);
				var result={"status":"200","guardian_details":rows};
				res.send(result);
			}else{
				var result={"status":"400"};
				res.send(result);
			}
		}
	});
	
}

function careTakerSubmittedDocuments(req,res){
	
	res.header("Access-Control-Allow-Origin", "*");
	console.log(req.body.email);
	
	fs.readdir("./"+req.body.email, function(err, files) {
	    if (err) { 
	    	return;
	    }else{
	    	console.log(files);
	    	res.send({"status":"200","fileList":files,"len":files.length});
	    }
	});
	
}	

function adminFetchAllDocuments(req,res){
	
	res.header("Access-Control-Allow-Origin", "*");
	console.log("nitesh wadhwa 1234");
	
	fs.readdir("./common", function(err, files) {
	    if (err) { 
	    	return;
	    }else{
	    	console.log(files);
	    	res.send({"status":"200","fileList":files,"len":files.length});
	    }
	});
}	

function showRequiredDocument(req,res){
	
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

function showSubmittedDocument(req,res){
	
	  res.header("Access-Control-Allow-Origin", "*");
	  var pdfParser = new PDFParser(this,1);
	  pdfParser.on("pdfParser_dataError", function(errData){
		  console.error(errData.parserError);
	  });
	  pdfParser.on("pdfParser_dataReady", function(pdfData){
	      fs.writeFile("./content.txt", pdfParser.getRawTextContent());
	  });
	  pdfParser.loadPDF("./"+req.body.folderName+"/"+req.body.documentName);
	  res.sendfile('content.txt');
}


function adminhomePage(req,res){
	res.header("Access-Control-Allow-Origin", "*");
	
		var sqlquery="select g.guradian_name,g.caretaker_email,c.caretaker_name from guardian_details g, caretaker_details c where g.caretaker_email = c.caretaker_email;";
		
		console.log(sqlquery);
		
		mysql.fetchData(sqlquery,function(err,rows){
			if(err){
				var result={"status":"400"};
				res.send(result);
			}else{
				if(rows.length > 0){
					console.log(rows);
					var result={"status":"200","guardian_details":rows,"len":rows.length};
					res.send(result);
				}else{
					var result={"status":"400"};
					res.send(result);
				}
			}
		});
		
	
}

function send(req,res){
	res.header("Access-Control-Allow-Origin", "*");
	
	var sqlquery="insert into documentpending(caretaker_email, documentName) values(";
	sqlquery+= "'"+req.body.email+"'";
	sqlquery+= ",";
	sqlquery+= "'"+req.body.documentName+"'";
	sqlquery+= ");";
	
	console.log(sqlquery);
	
	mysql.fetchData(sqlquery,function(err,rows){
		if(err){
			var result={"status":"400"};
			res.send(result);
		}else{
			var accountSid = 'AC3ca589a5e6c284d7798192745aab7ee8'; // Your Account SID from www.twilio.com/console
			var authToken = '2e10f6a976e68d87b8a246043b284544';   // Your Auth Token from www.twilio.com/console

		//	var twilio = require('twilio');
			var twilioLibrary = require('twilio');
			var client = new twilioLibrary.Twilio(accountSid, authToken);

			client.messages.create({
			    body: 'Hello from Node',
			    to: '+16692928628',  // Text this number
			    from: '+16692258681' // From a valid Twilio number
			}, function(err, message) {
				if(!err){
					console.log(message);
				}else{
					console.log(err);
				}
			    
			});
			res.send({"status":"200"});
		}
		
	});
}



exports.careTakerSubmittedDocuments=careTakerSubmittedDocuments;
exports.getCareTakerDetails=getCareTakerDetails;
exports.adminFetchAllDocuments=adminFetchAllDocuments;
exports.showRequiredDocument=showRequiredDocument;
exports.showSubmittedDocument=showSubmittedDocument;
exports.adminhomePage=adminhomePage;
exports.send=send;