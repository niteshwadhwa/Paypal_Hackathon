/**
 * New node file
 */
var mysql = require("./mysql.js");

function adminLogIN(req,res){
	res.header("Access-Control-Allow-Origin", "*");
	if(req.body.email === "kendal" && req.body.password === "kendal" && req.body.type === "admin"){
		
		var sqlquery="select g.guradian_name,g.caretaker_email,c.caretaker_name from guardian_details g, caretaker_details c where g.caretaker_email = c.caretaker_email;"
		
		
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
		
	}else{
		res.send({"status":"400"});
	}
}

exports.adminLogIN=adminLogIN;