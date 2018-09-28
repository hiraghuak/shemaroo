$(document).ready(function(){
 $("#user_register").click(function(){
 	$("#signup_name_error").hide();
 	var user_name = $("#user_name").val();
 	var mobile_no = $("#mobile_number").val();
 	var pwd = $("#password").val();
 	var cf_pwd = $("#confirm_password").val();
 	if(user_name.length != 0 && mobile_no.length != 0 && mobile_no.length == 10 && pwd.length != 0 && pwd.length >=6 && cf_pwd.length != 0 && cf_pwd.length >= 6 && (pwd == cf_pwd)){
		$.ajax({
			url: "/users/sign_up",
			type: "POST",
			data: { 
			name: user_name, 
			mobileno: mobile_no,
			password: pwd
			},
			success: function(response,status){
			 if(status == "true"){
	         
			 }
			else{

			 }
			}
		});
	}
	else if(user_name.length == 0){
		$("#signup_name_error").show();
	}
	else if(mobile_no.length == 0){
		$("#signup_mobile_error").show();
	}
	else if(mobile_no.length <= 9){
		$("#signup_mobile_error").text("Please enter the valid 10 digit number");
	}
	else if(user_name.length == 0){
		$("#signup_name_error").show();
	}
	else if(user_name.length == 0){
		$("#signup_name_error").show();
	}
	else if(user_name.length == 0){
		$("#signup_name_error").show();
	}
 })
})