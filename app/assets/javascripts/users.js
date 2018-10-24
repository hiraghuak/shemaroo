$(document).ready(function(){
   function user_signup(){
 	$("#signup_name_error,#signup_mobile_error,#signup_email_error,#signup_password,#signup_confirm_password,#terms_check").hide();
 	var user_name = $("#user_name").val();
 	var mobile_no = $("#mobile_number").val();
 	var email_id = $("#user_email").val();
 	var pwd = $("#password").val();
 	var cf_pwd = $("#confirm_password").val();
 	var terms_check = $("#agree_terms").is(':checked')
 	var status = false
 	var user_region = $(".user_region").val();
 	var regex_email = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
 	if(user_region == "IN"){
       if(user_name.trim().length != 0 && mobile_no.length != 0 && mobile_no.length == 10 && pwd.length != 0 && pwd.length >=6 && cf_pwd.length != 0 && cf_pwd.length >= 6 && (pwd == cf_pwd) && terms_check == true){
        status = true
        signup_type = "msisdn"
 	  }
 	}
 	else{
      if(user_name.trim().length != 0 && email_id.length != 0 && regex_email.test(email_id) && pwd.length != 0 && pwd.length >=6 && cf_pwd.length != 0 && cf_pwd.length >= 6 && (pwd == cf_pwd) && terms_check == true){
        status = true
        signup_type = "email"
 	  }
 	}
 	if(status == true){
		$("#user_register").text("Register..")
		$.ajax({
			url: "/users/sign_up",
			type: "POST",
			data: { 
			name: user_name, 
			mobileno: mobile_no,
			email_id: email_id,
		    type: signup_type,
			password: pwd
			},
			success: function(response,status){
			 console.log(response);
			 if(response.status == true){
			   $("#user_register").text("Register")
			   if(signup_type == "msisdn"){
			   	 $.cookie('user_registed_mobile_no',"91"+mobile_no, { expires: 14,path: '/'});
			   	 $("#user_name,#user_email,#mobile_number,#password,#confirm_password").val("");
			     window.location = "/users/verify_otp"
			   }
			   else{
			   	set_user_cookies(response);
			   	$("#user_name,#user_email,#password,#confirm_password").val("");
                $("#reg_success").modal({
                	backdrop: 'static'
                });
                //$("#signup_resp_error_msg").text("A verification Mail will be send to the Registered email id").show().fadeOut(800);
			   }
			 }
			else{
			 $("#user_register").text("Register")
			 //$("#user_name,#user_email,#password,#confirm_password").val("");
			 //$("#agree_terms").prop("checked", false);
             $("#signup_resp_error_msg").text(response.error_message).show().fadeOut(4500);
			 }
			}
		});
	}
	else if(user_name.trim().length == 0){
	  $("#signup_name_error").show();
	}
	
	else if(user_region == "IN" && mobile_no.length == 0){
	  $("#signup_mobile_error").show();
	}
	else if(user_region == "IN" && mobile_no.length != 0 && mobile_no.length != 10){
	  $("#signup_mobile_error").text("Please enter the valid 10 digit number").show();
	}
	else if(user_region != "IN" && email_id.length == 0){
		$("#signup_email_error").show();
	}
	else if(user_region != "IN" && !regex_email.test(email_id)){
	  $("#signup_email_error").text("Please enter the valid email address").show();
	}
	else if(pwd.length == 0){
	  $("#signup_password").show();
	}
	else if(pwd.length < 6){
	  $("#signup_password").text("Password must contains at least 6 characters").show();
	}
	else if(cf_pwd.length == 0){
	  $("#signup_confirm_password").show();
	}
	else if(cf_pwd.length < 6){
	  $("#signup_confirm_password").text("Confirm password must contains at least 6 characters").show();
	}
	else if(pwd != cf_pwd){
      $("#signup_confirm_password").text("Password and Confirm password not matched").show();
	}
	else if(terms_check == false){
	  $("#terms_check").show();
	}
 }

 $("#user_register").click(function(){
 	user_signup();
 });

$("#user_name,#mobile_number,#password,#confirm_password,#user_email").keypress(function(e){
  if(e.which == 13){
	user_signup();
  }
});


$("#user_name,#mobile_number,#user_email,#password,#confirm_password").focusin(function(){
 $("#signup_name_error,#signup_mobile_error,#signup_email_error,#signup_password,#signup_confirm_password,#terms_check").hide();
});

/*$("#mobile_number,#first_digit,#second_digit,#third_digit,#fourth_digit").on("keypress keyup blur",function (event) {    
   $(this).val($(this).val().replace(/[^\d].+/, ""));
    if ((event.which < 48 || event.which > 57)) {
        event.preventDefault();
    }
});*/

function set_user_cookies(resp){
 $.cookie('user_id',resp.user_id, { expires: 14,path: '/'});
 $.cookie('user_login_id',resp.login_id, { expires: 14,path: '/'});
 $.cookie('user_name',resp.user_name, { expires: 14,path: '/'});
 $.cookie('profile_id',resp.profile_id, { expires: 14,path: '/'});
 $.cookie('user_profiles',resp.user_profiles, { expires: 14,path: '/'})
}

$("#verify_otp").click(function(){
  $("#verify_otp_error,#resend_otp_msg").hide();
  var first_no  = $("#first_digit").val();
  var second_no = $("#second_digit").val();
  var third_no  = $("#third_digit").val();
  var fouth_no  = $("#fourth_digit").val();
  if(first_no.length != 0 && second_no.length != 0 && third_no.length != 0 && fouth_no.length != 0){
	  $("#verify_otp").text("Verifying..")
		$.ajax({
			url: "/users/validate_otp",
			type: "POST",
			data: { 
			 otp: first_no+second_no+third_no+fouth_no
			},
			success: function(response,status){
			 console.log(response);
			if(response.status == true){  
			  set_user_cookies(response)
			  $.removeCookie('user_registed_mobile_no', { path: '/' });
			  $("#otp_success").modal({
			  	backdrop: 'static'
			  });
			}
			else{
			 $("#verify_otp").text("Verify")
			 $("#first_digit,#second_digit,#third_digit,#fourth_digit").val("");
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

$("#first_digit,#second_digit,#third_digit,#fourth_digit").focus(function(){
   $("#verify_otp_error").hide();
})

/*Resend Otp */

$("#resend_otp").click(function(){
	var mobile_number = getShemarooCookies().user_registed_mobile_no;
	$.ajax({
		url: "/users/resend_otp",
		type: "POST",
		data: { 
		 mobile_no: mobile_number 
		},
		success: function(response,status){
		console.log(response);
		if(response.status == true){  
		 $("#resend_otp_msg").show();
		}
		else{
		 $("#resend_otp_msg").text(response.error_message).show();
		}
		}
	});
})


function user_sign_in(){
 $("#login_mobile_error,#login_pwd_error").hide();
 var mobile_no = $("#login_mobile_number").val();
 var user_email_id = $("#login_email").val();
 var pwd = $("#login_password").val();
 var user_region = $(".user_region").val();
 var regex_email = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
 var error_status = false
 if(user_region == "IN"){
  if(mobile_no.length != 0 && mobile_no.length == 10 && pwd.length != 0 && pwd.length >=6){
  	error_status = true
  	login_type = "msisdn"
  }
 }
 else{
   if(user_email_id.length != 0 && regex_email.test(user_email_id) && pwd.length != 0 && pwd.length >=6){
   	error_status = true
   	login_type = "email"
   }
 }
 if(error_status == true){
	$("#user_login").text("Login...")
	$.ajax({
		url: "/users/sign_in",
		type: "POST",
		data: { 
		mobile_no: mobile_no, 
		email_id: user_email_id,
		password: pwd,
		type: login_type
		},
		success: function(response,status){
		 $("#user_login").text("Login")
		 if(response.status == true){
		   set_user_cookies(response)
		   window.location = "/"
		 }
		else{
		 //$("#login_mobile_number,#login_password,#login_email").val("");
	     $("#bakend_user_errors").text(response.error_message).show().fadeOut(2000);
		 }
		}
	});
 }
 else if(user_region == "IN" && mobile_no.length == 0){
  $("#login_mobile_error").show();
 }
 else if(user_region == "IN" && mobile_no.length != 10){
  $("#login_mobile_error").text("Please enter the valid 10 digit number").show();
 }
 else if(user_region != "IN" && user_email_id.length == 0){
  $("#login_email_error").show();
 }
 else if(user_region != "IN" && !regex_email.test(user_email_id)){
  $("#login_email_error").show("Please enter the valid email address").show();;
 }
 else if(pwd.length == 0){
  $("#login_pwd_error").show();
 }
 else if(pwd.length < 6){
  $("#login_pwd_error").text("Password must contains at least 6 characters").show();
 }
}

$("#user_login").click(function(){
  user_sign_in();
})

$("#login_mobile_number,#login_password,#login_email").keypress(function(e){
  if(e.which == 13){
	user_sign_in();
  }
});


$("#login_mobile_number,#login_password,#login_email").focusin(function(){
 $("#login_mobile_error,#login_pwd_error,#login_email_error").hide();
});



$("#otp_success_close,#user_email_close,#user_email_process,#otp_success_process").click(function(){
	window.location = "/users/welcome"
})


 function delete_user_cookies(){
  document.cookie = 'user_id' + '=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  document.cookie = 'user_login_id' + '=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  document.cookie = 'user_name' + '=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  document.cookie = 'profile_id' + '=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  document.cookie = 'user_profiles' + '=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
 }

 $("#user_signout,#user_mobile_signout").click(function(){
   var current_path = window.location.pathname;
  $.ajax({
    url: "/users/sign_out",
    type: "POST",
    data: { },
    success: function(response,status){
    console.log(response);
    if(response.status == true){ 
     delete_user_cookies();
     window.location = "/";
     /*if(current_path == "/users/welcome"){
      window.location = "/";
     } 
     else{
     	window.location.reload();
     }*/
    }
    }
  });
 })


$("input[type='text'], input[type='password']").keyup(function() {
    var inputlenth = $(this).val().length;
    var id_val = $(this).attr("id");
    
    if(inputlenth > 0) {
      if(id_val == 'mobile_number' || id_val == 'login_mobile_number') {
        $(this).parents(".input-group").children('.fa-circle').hide();
        $(this).nextAll(".input-group .input-label").css({"top":"-16px","left":"0px"});  
      }
      else {
        $(this).parents(".input-group").children('.fa-circle').hide();
        $(this).nextAll(".input-group .input-label").css({"top":"-16px","left":"0px"});    
      }
    }
    else {
      if(id_val == 'mobile_number' || id_val == 'login_mobile_number') {
        $(this).parents(".input-group").children('.fa-circle').show();
        $(this).nextAll(".input-group .input-label").css({"top":"7px","left":"37px"});    
      }
      else {
        $(this).parents(".input-group").children('.fa-circle').show();
        $(this).nextAll(".input-group .input-label").css({"top":"7px","left":"10px"});      
      }
    }
  });
	
	$('textarea').keyup(function() {
    var inputlenth = $(this).val().length;
    if(inputlenth > 0) { 

    	$(this).parents(".input-group").children('.fa-circle').hide();
      $(this).nextAll(".input-group .input-label").css({"top":"-25px","left":"0px"}); 
    }
    else {
    	$(this).parents(".input-group").children('.fa-circle').show();
      $(this).nextAll(".input-group .input-label").css({"top":"7px","left":"10px"});
    }
  }); 	

 $("#update_profile").click(function(){
 	var profile_name = $("#edit_profile_name").val();
 	var profile_id = window.location.pathname.split("/users/edit_profile/")[1];
 	var ischild = $(".material-switch-control-input").is(':checked')
 	if(profile_name.length != 0){
 	 $("#update_profile").text("Done..");
     $.ajax({
		url: "/users/update_profile",
		type: "POST",
		data: { 
			profileid: profile_id,
			name: profile_name,
			is_child: ischild
		},
		success: function(response,status){
		 $("#update_profile").text("Done");
		 $("#profile_sucess_up_msg").show().fadeOut(4500);
		}
	});
 	}
 	else if(profile_name.length == 0){
     $("#edit_profile_name_error").show();
 	}
 });

 $("#edit_profile_name").focusin(function(){
   $("#edit_profile_name_error").hide();
 });

 
  $("#delete_user_profile").click(function(){
 	 var profile_id = window.location.pathname.split("/users/edit_profile/")[1];
 	 $("#delete_user_profile").text("DELETE THIS PROFILE....");
    $.ajax({
			url: "/users/delete_profile",
			type: "POST",
			data: { 
			profileid: profile_id
			},
			success: function(response,status){
 	     $("#delete_user_profile").text("DELETE THIS PROFILE....");
 	       window.location = "/users/manage_profiles"
			 }
	  });
 	});

 $("#update_personal_details").click(function(){
 	$("#user_name_error").hide();

 	var name = $("#user_profile_name").val();
 	var mobile_no = $("#user_mobile_number").val();
 	var user_email = $("#user_email_address").val();
 	var user_dob = $("#user_dob").val();
 	 if(name.length != 0){
	 	 	$("#update_personal_details").text("DONE...");
	    $.ajax({
				url: "/users/update_personal_details",
				type: "POST",
				data: { 
				 profile_name: name
				},
				success: function(response,status){
	 	     $("#update_personal_details").text("DONE");
				 }
		  });
 	 }
 	 else if(name.length == 0){
 	 	$("#user_name_error").show()
 	 }
 })
 $("#user_profile_name").focusin(function(){
   $("#user_name_error").hide();
 });

 $("#add_profile").click(function(){
 	 var profile_name = $("#profile_name").val();
 })

















})