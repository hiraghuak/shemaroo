$(document).ready(function(){
	$('.close-hambergmenu img').click(function() {
		$('.fixed-top .navbar-collapse').removeClass('show');	
	});
  /*var window_height = window.outerHeight;
  var window_height = window_height - 231;
  $('.full-width-content').css('min-height',window_height+'px');*/

	$("#search").keyup(function(e){
	  $("#search_heading,#recent_search").hide();
	  $(".cancel_search").show();
	  $("#search_all_results,.search_count").html("");
	  var search_val = $(this).val();
	  if(search_val.length != 0 && search_val != "%"){
	  	$.ajax({ 
	        type: 'POST', 
	        url: '/search', 
	        data: {'search' : search_val }, 
	        success: function(response){
	        	$("#search_heading").show();
	          var search_results = response.results;
	         if(search_results.length != 0){
	         	  if(getShemarooCookies().recent_search_data){
	         	  	search_data = getShemarooCookies().recent_search_data+","+search_val
	         	  }
	         	  else{
	         	  	search_data = search_val
	         	  }
	         		$.cookie('recent_search_data',search_data, { expires: 14,path: '/'});
	            $('#search_all_results').html(''); 
	            for (var i = 0; i < search_results.length; i++) {
	             var r = search_results[i].split("$");
	              $('#search_all_results').append('<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col- margin-bottom-10"><div class="row1"><div class="search-image-wrap"><span class="premium-txt text-uppercase" style="display:none;">premium</span><a href="'+r[5]+'"><img src="'+r[0]+'" class="img-fluid rounded tile-box-shadow" alt="'+r[1]+'" title="'+r[1]+'"></a></div><div class="search-category-wrap"><p class="search-tile-title">'+r[1]+'</p><p class="search-tile-category"> '+r[2]+' | '+r[3]+' | '+r[4]+'</p></div></div></div>');
            	  $(".search_count").text(search_results.length)
            	   e.stopPropagation();
	             }
	          }
	          else {
	          	
	          }
	        } 
	    });
	  }
	  else{
	   $("#search_all_results").html("");
		 $("#search").val("");
		 $(".cancel_search,#search_heading").hide();
	  }
	});

	$(".cancel_search").click(function(){
		$("#search_all_results").html("");
		$("#search").val("");
		$(".cancel_search,#search_heading").hide();
	})

});













