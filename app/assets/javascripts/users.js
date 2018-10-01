$(document).ready(function(){
 $("#user_register").click(function(){
 	$("#signup_name_error,#signup_mobile_error,#signup_password,#signup_confirm_password,#terms_check").hide();
 	var user_name = $("#user_name").val();
 	var mobile_no = $("#mobile_number").val();
 	var pwd = $("#password").val();
 	var cf_pwd = $("#confirm_password").val();
 	var terms_check = $("#agree_terms").is(':checked')
 	if(user_name.length != 0 && mobile_no.length != 0 && mobile_no.length == 10 && pwd.length != 0 && pwd.length >=6 && cf_pwd.length != 0 && cf_pwd.length >= 6 && (pwd == cf_pwd) && terms_check == true){
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
	else if(pwd.length == 0){
	  $("#signup_password").show();
	}
	else if(pwd.length < 6){
	  $("#signup_password").text("Password must contain at least 6 characters");
	}
	else if(cf_pwd.length == 0){
	  $("#signup_confirm_password").show();
	}
	else if(cf_pwd.length < 6){
	  $("#signup_confirm_password").text("Confirm password must contain at least 6 characters");
	}
	else if(pwd != cf_pwd){
      $("#signup_confirm_password").text("Confirm password must contain at least 6 characters");
	}
	else if(terms_check == false){
	  $("#terms_check").show();
	}
 })



$("#mobile_number").on("keypress keyup blur",function (event) {    
   $(this).val($(this).val().replace(/[^\d].+/, ""));
    if ((event.which < 48 || event.which > 57)) {
        event.preventDefault();
    }
});

$("#verify_otp").click(function(){
	$("#verify_otp_error").hide();
  var first_no  = $("#first_digit").val();
  var second_no = $("#second_digit").val();
  var third_no  = $("#third_digit").val();
  var fouth_no  = $("#fourth_digit").val();
  if(first_no.length != 0 && second_no.length != 0 && third_no.length != 0 && fouth_no.length != 0){
		$("#verify_text").text("Verifying..")
		$.ajax({
			url: "/users/validate_otp",
			type: "POST",
			data: { 
			 //otp: first_no+second_no+third_no+fouth_no
			 otp: "665524"
			},
			success: function(response,status){
				console.log(response);
			if(response.status == true){  
				
			}
			else{
				$("#verify_text").text("Verify")
				$("#verify_otp_error").text(response.error_message).show();
			}
			}
		});
  }
  else if(first_no.length == 0){
	  $("#verify_otp_error").show();
	}
	else if(second_no.length == 0){
	  $("#verify_otp_error").show();
	}
	else if(third_no.length == 0){
	  $("#verify_otp_error").show();
	}
	else if(fouth_no.length == 0){
	  $("#verify_otp_error").show();
	}
})

/*Resend Otp */

$("#resend_otp").click(function(){
	var mobile_number = "918919390856"
	$.ajax({
		url: "/users/resend_otp",
		type: "POST",
		data: { 
		 mobile_no: mobile_number 
		},
		success: function(response,status){
		console.log(response);
		if(response.status == true){  
			$("#verify_otp_error").text("Otp sent sucessfully").show();
		}
		else{
		 $("#verify_otp_error").text(response.error_message).show();
		}
		}
	});
})
















});