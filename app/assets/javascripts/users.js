$(document).ready(function(){
 $("#user_register").click(function(){
 	var user_name = $("#user_name").val();
 	var mobile_no = $("#mobile_no").val();
 	var pwd = $("#password").val();
 	var cf_pwd = $("#confirm_password").val();
	$.ajax({
		url: "/users/sign_in",
		type: "POST",
		data: { 
		name: user_name, 
		mobileno: mobile_no,
		password: pwd,
		confirm_password: cf_pwd
		},
		success: function(response,status){
		}
	});
 })
})