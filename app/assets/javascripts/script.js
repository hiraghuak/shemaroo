$(document).ready(function(){
	$('.close-hambergmenu img').click(function() {
		$('.fixed-top .navbar-collapse').removeClass('show');	
	});
  /*var window_height = window.outerHeight;
  var window_height = window_height - 231;
  $('.full-width-content').css('min-height',window_height+'px');*/

	$("#search").keyup(function(e){
	  var search_val = $(this).val();
	  if(search_val.length != 0 && search_val != "%"){
	  	$.ajax({ 
	        type: 'POST', 
	        url: '/search', 
	        data: {'search' : search_val }, 
	        success: function(response){
	        	console.log(response);
	         if(response.length != 0){
	            $('.search_results').html('');
	            for (var i = 0; i < response.length; i++) {
	            	 e.stopPropagation();
	            }
	          }
	          else {
	          	
	          }
	        } 
	    });
	  }
	});

});













