/**
 * New node file
 */

var mysql = require("./mysql.js");
var fs = require('fs');



function careTakerSignUp(req,res){
	
	res.header("Access-Control-Allow-Origin", "*");
	console.log(req.body);
	
	var sqlquery="insert into caretaker_details(caretaker_name, caretaker_email, caretaker_contact, caretaker_address, caretaker_password) values(";
	sqlquery+= "'"+req.body.name+"'";
	sqlquery+= ",";
	sqlquery+= "'"+req.body.email+"'";
	sqlquery+= ",";
	sqlquery+= "'"+req.body.contact+"'";
	sqlquery+= ",";
	sqlquery+= "'"+req.body.address+"'";
	sqlquery+= ",";
	sqlquery+= "'"+req.body.password+"'";
	sqlquery+= ");";
	
	console.log(sqlquery);
	
	mysql.fetchData(sqlquery,function(err,rows){
		if(err){
			console.log("return");
			var result={"status":"400"};
			res.send(result);
		}else{
			var dir = './'+req.body.email;

			if (!fs.existsSync(dir)){
				console.log(dir);
				console.log("creation successful");
			    fs.mkdirSync(dir);
			}
			res.send({"status":"200"});
		}
		
	});
	
	
}

function careTakerDashboard(email,callback){
	
	var sqlquery="select * from documentpending where caretaker_email=";
	sqlquery+= "'"+email+"'";
	sqlquery+= ";";
		
	mysql.fetchData(sqlquery,function(err,rows){
			callback(rows);
	});
	
}




function careTakerLogIN(req,res){
	
	res.header("Access-Control-Allow-Origin", "*");
	
	var sqlquery="select * from caretaker_details where caretaker_email=";
	sqlquery+= "'"+req.body.email+"'";
	sqlquery+= " and caretaker_password=";
	sqlquery+= "'"+req.body.password+"'";
	sqlquery+= ";";
	
	console.log(sqlquery);
	
	mysql.fetchData(sqlquery,function(err,rows){
		if(err){
			var result={"status":"400"};
			res.send(result);
		}else{
			if(rows.length === 1){
				careTakerDashboard(req.body.email,function(data){
					var result={"status":"200","rows":data};
					res.send(result);
				});
			}else{
				var result={"status":"400"};
				res.send(result);
			}
		}
	});
	
	
	
}



exports.careTakerSignUp=careTakerSignUp;
exports.careTakerLogIN=careTakerLogIN;