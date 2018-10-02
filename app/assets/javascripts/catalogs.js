$(document).ready(function(){
 function delete_cookies(){
 	var cookies = $.cookie();
	for(var cookie in cookies) {
	   $.removeCookie(cookie);
	}
 }

 $("#user_signout,#user_mobile_signout").click(function(){
	$.ajax({
		url: "/users/sign_out",
		type: "POST",
		data: {},
		success: function(response,status){
		console.log(response);
		if(response.status == true){ 
		 delete_cookies(); 
		 location.reload();
		}
		}
	});
 })
})