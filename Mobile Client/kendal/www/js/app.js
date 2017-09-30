// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app=angular.module('Kendal_App', ['ionic','ngCordova'])
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

app.controller('Kendal_Controller', function($scope, $http, $ionicPopup, $cordovaEmailComposer) {
	
	$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
	path="http://192.168.83.113:3000/";
	
	
	$scope.navSlide = function(index) {
		$ionicSlideBoxDelegate.slide(index, 100);
	}
	
	var canvas = document.getElementById("signatureCanvas");
	var signaturePad = new SignaturePad(canvas);
	
	$scope.clearCanvas = function(){
		signaturePad.clear();
	}
	
	$scope.saveCanvas = function(){
		var sigImg = signaturePad.toDataURL();
		$scope.signature = sigImg;
		
		
		$http({
				method:'POST',
				url: path+'careTakerShowDocument',
				data: Object.toparams({"documentName":$scope.documentID.documentName})
			}).then(function(res){
				var docDefinition = {
					content: [
						{ text: res.data, fontSize: 15 },
						{ image: $scope.signature}
					]
				};
				var pdfDoc = pdfMake.createPdf(docDefinition);
				pdfDoc.open(); 
				
				$http({
					method:'POST',
					url: path+'deleteFromTable',
					data: Object.toparams({"documentName":$scope.documentID.documentName,"email":$scope.careTakerEmail.email})
				}).then(function(res){
					if(res.data.status=="200"){
					$scope.defaultShow();
					$scope.careTaker_Home=true;
					$scope.careTakerFooter=true;
					$scope.documentPendingArray = [];
						for(var i=0;i<res.data.rows.length; i++){
							$scope.documentPendingArray[i]=res.data.rows[i];
						}
					}
				});
		});
		
	}
	
	
	Object.toparams = function ObjecttoParams(obj) {
		var p = [];
		for (var key in obj) {
			p.push(key + '=' + encodeURIComponent(obj[key]));
		}
		return p.join('&');
	};
	
	$scope.loginFooter=true;
	$scope.loginHeader=true;
	$scope.slider_image=true;
	
	$scope.defaultShow = function(){
		$scope.userSignIn=false;
		$scope.loginFooter=false;
		$scope.loginHeader=false;
		$scope.admin_Home=false;
		$scope.adminFooter=false;
		$scope.admin_guardianDetailsShow=false;
		$scope.careTakerSubmittedDocumentShow=false;
		$scope.adminRequiredDocumentShow=false;
		$scope.slider_image=false;
		$scope.userSignUp=false;
		$scope.careTaker_Home=false;
		$scope.careTakerFooter=false;
		$scope.imagework=false;
	}
	
	$scope.signIn_Show=function(){
		$scope.defaultShow();
		$scope.logout_1=false;
		$scope.loginFooter=true;
		$scope.loginHeader=true;
		$scope.userSignIn=true;
		$scope.userSignIn = {bussiness: false}
	}
	
	
	$scope.signUp_Show=function(){
		$scope.defaultShow();
		$scope.loginFooter=true;
		$scope.loginHeader=true;
		$scope.userSignUp=true;
		$scope.userSignUp = {bussiness: false}
	}
	
	$scope.careTakerEmail = {"1":"1"};
	
	$scope.signIn_Operate=function(userSignIn){
		if(userSignIn.admin == true){
			$http({
				method:'POST',
				url: path+'adminLogIN',
				data: Object.toparams({"email":userSignIn.email,"password":userSignIn.password,"type":"admin"})
			}).then(function(res){
				if(res.data.status=="200"){
					$scope.defaultShow();
					$scope.admin_Home=true;
					$scope.adminFooter=true;
					$scope.guardian_detailsArray = [];
					for(var i=0;i<res.data.len; i++){
						$scope.guardian_detailsArray[i]=res.data.guardian_details[i];
					}
				}else{
					alert("Please enter valid details");
				}
			});
		}else{
			
			$http({
				method:'POST',
				url: path+'careTakerLogIN',
				data: Object.toparams({"email":userSignIn.email,"password":userSignIn.password,"type":"user"})
			}).then(function(res){
				if(res.data.status=="200"){
					$scope.defaultShow();
					$scope.careTaker_Home=true;
					$scope.careTakerFooter=true;
					$scope.documentPendingArray = [];
					$scope.careTakerEmail = {"email":userSignIn.email};
					for(var i=0;i<res.data.rows.length; i++){
						$scope.documentPendingArray[i]=res.data.rows[i];
					}
				}else{
					alert("Please enter valid details");
				}
			});
		
		}
	}
	
	
	$scope.signUp_Operate=function(signUp_Form_Details){
		
			$http({
				method:'POST',
				url: path+'careTakerSignUp',
				data: Object.toparams({"name":signUp_Form_Details.name,"email":signUp_Form_Details.email,"password":signUp_Form_Details.password,"contact":signUp_Form_Details.contact,"address":signUp_Form_Details.address})
			}).then(function(res){
				if(res.data.status=="200"){
					alert("SignUp Successful, Please Login to continue");
					$scope.defaultShow();
					$scope.loginFooter=true;0
					$scope.loginHeader=true;
					$scope.userSignIn=true;
					$scope.userSignIn = {bussiness: false}
					
				}else{
					alert("Please enter valid details");
				}
			});
	}
	
	
	
	$scope.getCareTakerDetails=function(email){
		$http({
				method:'POST',
				url: path+'getCareTakerDetails',
				data: Object.toparams({"email":email})
			}).then(function(res){
				if(res.data.status=="200"){
					$scope.defaultShow();
					$scope.adminFooter=true;
					$scope.admin_guardianDetailsShow=true;
					$scope.guardian_details = {guradian_name:res.data.guardian_details[0]["guradian_name"],caretaker_name:res.data.guardian_details[0]["caretaker_name"],caretaker_email:res.data.guardian_details[0]["caretaker_email"],caretaker_contact:res.data.guardian_details[0]["caretaker_contact"],caretaker_address:res.data.guardian_details[0]["caretaker_address"]};
				}else{
					alert("Please enter valid details");
				}
			});
			
	}
	
	
	$scope.adminrequiredDocuments=function(){
		$http({
				method:'POST',
				url: path+'adminFetchAllDocuments',
				data: Object.toparams({"pdfName":"pdfName"})
			}).then(function(res){
				$scope.defaultShow();
				$scope.adminFooter=true;
				$scope.adminRequiredDocumentShow=true;
				if(res.data.status=="200"){
					$scope.requiredDocumentArray = [];
					for(var i=0;i<res.data.len; i++){
						$scope.requiredDocumentArray[i]=res.data.fileList[i];
					}
				}else{
				
				}
			});
	}
	
	$scope.careTakerSubmittedDocumentEmail = {"1":"1"};
	
	$scope.careTakerSubmittedDocuments=function(email){
		$scope.careTakerSubmittedDocumentEmail = {"email":email};
		$http({
				method:'POST',
				url: path+'careTakerSubmittedDocuments',
				data: Object.toparams({"email":email})
			}).then(function(res){
				$scope.defaultShow();
				$scope.adminFooter=true;
				$scope.careTakerSubmittedDocumentShow=true;
				if(res.data.status=="200"){
					$scope.careTakerSubmittedDocumentsArray = [];
					for(var i=0;i<res.data.len; i++){
						$scope.careTakerSubmittedDocumentsArray[i]=res.data.fileList[i];
					}
				}else{
				
				}
			});
	}
	
	$scope.showRequiredDocument=function(documentName){
		$http({
				method:'POST',
				url: path+'showRequiredDocument',
				data: Object.toparams({"documentName":documentName})
			}).then(function(res){
				alert(res.data);
			});
	}
	
	
	$scope.showSubmittedDocument=function(documentName){
		$http({
				method:'POST',
				url: path+'showSubmittedDocument',
				data: Object.toparams({"folderName":$scope.careTakerSubmittedDocumentEmail.email,"documentName":documentName})
			}).then(function(res){
				alert(res.data);
			});
	}
	
	
	
	$scope.careTakerShowDocument=function(documentName){
		$http({
				method:'POST',
				url: path+'careTakerShowDocument',
				data: Object.toparams({"documentName":documentName})
			}).then(function(res){
				alert(res.data);
			});
	}
	
	
	
	
	
	$scope.admin_homePage=function(){
		$http({
				method:'POST',
				url: path+'adminhomePage',
				data: Object.toparams({"email":"email"})
			}).then(function(res){
				if(res.data.status=="200"){
					$scope.defaultShow();
					$scope.admin_Home=true;
					$scope.adminFooter=true;
					$scope.guardian_detailsArray = [];
					for(var i=0;i<res.data.len; i++){
						$scope.guardian_detailsArray[i]=res.data.guardian_details[i];
					}
				}else{
					alert("Please enter valid details");
				}
			});
	
	}
	
	
	
	
	$scope.careTakerShowSubmittedDocuments=function(){
		$http({
				method:'POST',
				url: path+'careTakerSubmittedDocuments',
				data: Object.toparams({"email":$scope.careTakerEmail.email})
			}).then(function(res){
				$scope.defaultShow();
				$scope.careTakerFooter=true;
				$scope.careTakerSubmittedDocumentShow=true;
				if(res.data.status=="200"){
					$scope.careTakerSubmittedDocumentsArray = [];
					for(var i=0;i<res.data.len; i++){
						$scope.careTakerSubmittedDocumentsArray[i]=res.data.fileList[i];
					}
				}else{
				
				}
			});
	}
	
	$scope.careTaker_homePage=function(){
		
		$http({
				method:'POST',
				url: path+'careTakerHomePage',
				data: Object.toparams({"email":$scope.careTakerEmail.email})
			}).then(function(res){
				if(res.data.status=="200"){
					$scope.defaultShow();
					$scope.careTaker_Home=true;
					$scope.careTakerFooter=true;
					$scope.documentPendingArray = [];
					for(var i=0;i<res.data.rows.length; i++){
						$scope.documentPendingArray[i]=res.data.rows[i];
					}
				}else{
					alert("Please enter valid details");
				}
			});
		
	}
	
	
	$scope.send=function(email,documentName){
		$http({
				method:'POST',
				url: path+'send',
				data: Object.toparams({"email":email,"documentName":documentName})
			}).then(function(res){
				if(res.data.status=="200"){
					alert("Document sent successfuly to the care taker");
					$scope.admin_homePage();
				}else{
					alert("This document is already pending with the care taker");
				}
			});
	}
	
	$scope.documentID = {"1":"1"};
	
	$scope.sign=function(documentName){
		$scope.defaultShow();
		$scope.careTakerFooter=true;
		$scope.imagework=true;
		$scope.documentID = {"documentName":documentName};
	}
	
	
	$scope.backFromImage=function(req,res){
		$scope.clearCanvas();
		$scope.defaultShow();
		$scope.careTakerFooter=true;
		$scope.careTaker_Home=true;
	}
	
	
	$scope.clientPDFReader = function() {
        
			$http({
				method:'POST',
				url: path+'clientPDFReader',
				data: Object.toparams({"pdfName":"pdfName"})
			}).then(function(res){
				if(res.data.status=="200"){
					alert("success");
				}else{
					alert(res.data);
				}
			});
			
    }
	
	
});