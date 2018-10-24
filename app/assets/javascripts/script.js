$(document).ready(function(){
	if(getShemarooCookies().user_id){
		$(".with_login_item").show();
		$(".with_out_login_item").hide();
		$(".mobile_with_login").show();
        $(".mobile_with_out_login_item").hide();
	}
	else{
		$(".with_login_item").hide();
		$(".with_out_login_item").show();
	}
	// var window_height = window.outerHeight;
 //  	var window_height = window_height - 231;
 //  	$('.min-height-div').css('min-height',window_height+'px');

	/*$('.close-hambergmenu img').click(function() {
		$('.fixed-top .navbar-collapse').removeClass('show');	
	});*/

	$('.header .navbar-toggler').on('click', function() {
      /*$navMenuCont = $($(this).data('target'));
      $("#my-navbar-collapse").addClass("navbar-collapse");
      $navMenuCont.animate({'width':'toggle'}, 350);
      $("#my-navbar-collapse .fa-times").show(400);
      $(".mobile-menu-overlay").css("display", "block");*/
      $("body").addClass("noscroll");
    });
    $(".close-hambergmenu img").on('click', function(){
      $('.fixed-top .navbar-collapse').removeClass('show');
      $("body").removeClass("noscroll");
    });
	// var window_height = window.outerHeight;
 //  var window_height = window_height - 231;
 //  $('.min-height-div').css('min-height',window_height+'px');

	$("#search").keyup(function(e){
	  $("#search_heading,#recent_search").hide();
	  $(".cancel_search").show();
	  $("#search_all_results,.search_count").html("");
	  var search_val = $(this).val().replace(/ /g,"%20");
	  if(search_val.length != 0 && search_val != "%"){
	  // $(".spinner").show();
	  if(e.which == 13){
       window.location = "/search?q="+$(this).val().replace(/ /g,"%20");
     }
     else{
	  	$.ajax({ 
	        type: 'POST', 
	        url: '/search', 
	        data: {'search' : search_val }, 
	        success: function(response){
	        	//$(".spinner").hide();
	        	$("#search_heading").show();
	          var search_results = response.results;
	         if(search_results.length != 0){
	         	  if(getShemarooCookies().recent_search_data){
	         	  	search_data = getShemarooCookies().recent_search_data+","+search_val
	         	  }
	         	  else{
	         	  	search_data = search_val
	         	  }
	         	// $.cookie('recent_search_data',search_data, { expires: 14,path: '/'});
	            $('#search_all_results').html(''); 
	            for (var i = 0; i < search_results.length; i++) {
	             var r = search_results[i].split("$");
	              $('#search_all_results').append('<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col- margin-bottom-10"><div class="row1"><div class="search-image-wrap"><span class="premium-txt text-uppercase" style="display:none;">premium</span><a href="'+r[5]+'"><img src="'+r[0]+'" class="img-fluid rounded tile-box-shadow" alt="'+r[1]+'" title="'+r[1]+'"></a></div><div class="search-category-wrap"><a href="'+r[5]+'"><p class="search-tile-title text-ellipsis">'+r[1]+'</p></a><p class="search-tile-category"> '+r[2]+' | '+r[3]+' | '+r[4]+'</p></div></div></div>');
            	  $(".search_count").text(search_results.length)
            	   e.stopPropagation();
	             }
	          }
	          else {
	          	$("#search_heading").hide();
	          	$("#search_all_results").html("");
	          	$("#search_all_results").append('<div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col- no-content-wrap text-center"><img src="/assets/no_result.svg" class="search-no-results-image" alt="no search results" title="no search results"><p class="margin-bottom-0 font-medium text-ellipsis"><strong>Sorry, No Result was found for <span class="searched_text"></span></strong></p><p class="font-light">Please check the spelling or try another search term.</p></div></div>')
	            $(".searched_text").text(search_val.toUpperCase());
	          }
	        } 
	    });
	    }
	  }
	  else{
	  	 $(".search_errors").show().fadeOut(2000);
	     $("#search_all_results").html("");
		 $("#search").val("");
		 $(".cancel_search,#search_heading").hide();
	  }
	});


	$(".cancel_search").click(function(){
		$("#search_all_results").html("");
		$("#search").val("");
		$(".cancel_search,#search_heading").hide();
		$("#recent_search").show();
	})

	$("#clear_search").click(function(){
  	  $.removeCookie('recent_search_data', { path: '/' });
  	  $(this).hide();
  	  $("#user_recent_search").html('<li class="list-group-item border-top-0 padding-left-0">You have not searched anything recently!</li>');
    });

  
  


 $("#load_more").click(function() {
 	
 })

  
 $(".input-group img.show_password").click(function() {
      $(this).parent(".input-group").toggleClass("hide_password");
      $(this).prev().attr('type', function(index, attr){
        return attr == "password" ? "text" : "password";
      });
    });


/*$(document).click(function() { 
	//$('#right-sidebar-menu').hide(); \
	value = $('#right-sidebar-menu').css('width') === '250px' ? '0px' : '250px';
    var hide = $('#right-sidebar-menu').css('opacity') === 1 ? 0 : 1;
      $('#right-sidebar-menu').animate({
          width: value,
          opacity: "0"          
      }, 'fast');
});*/


$('.user_menu').click(function(event) {
	if(getShemarooCookies().user_id){
	var user_profiles = getShemarooCookies().user_profiles.split(",");
	console.log(user_profiles.length);
	var user_data = ''
	for(i=0;i< user_profiles.length;i++){
		var user_name = user_profiles[i].split("$")
		if(i == 1){
			//user_data+= '<div class="item active"><img src="/assets/profile.svg" alt="profile" title="profile"><p>'+user_name[1].substr(0,1).toUpperCase()+'</p><span class="text-uppercase">'+user_name[1]+'</span></div>'
       	    user_data+= '<li class="active text-ellipsis"><img src="/assets/profile.svg" alt="profile" title="profile"><p>'+user_name[1].substr(0,1).toUpperCase()+'</p><span class="text-uppercase">'+user_name[1]+'</span></li>'
		}
		else{
			//user_data+= '<div class="item"><p>'+user_name[1].substr(0,1).toUpperCase()+'</p><span class="text-uppercase">'+user_name[1]+'</span></div>'
		  user_data+= '<li class="text-ellipsis"><p>'+user_name[1].substr(0,1).toUpperCase()+'</p><span class="text-uppercase">'+user_name[1]+'</span></li>'
		}
	}
	
	$("#header_user_profiles").html(user_data);
	load_profiles();
    $(".with_login_item").show();
    $(".with_out_login_item").hide();
   }
  $('.user_menu').css("z-index", "1");
var window_height = window.outerHeight;
$("body").addClass("noscroll");
$("#right-sidebar-menu").css({"height": window_height, "opacity": "1"} );  

    value = $('#right-sidebar-menu').css('width') === '0px' ? '250px' : '0px';
    var show = $('#right-sidebar-menu').css('opacity') === 0 ? 1 : 0;
      $('#right-sidebar-menu').animate({
          width: "250px"          
      }, 250);
    //event.stopPropagation();  
});
/*$('#right-sidebar-menu').click(function(event) {
	event.stopPropagation();  
}) */

function load_profiles() {
	var navigation = [
      '<span aria-label="' + 'Previous' + '"><img src="/assets/big_left_arrow.svg" alt="" title=""></span>',
      '<span aria-label="' + 'Next' + '"><img src="/assets/big_right_arrow.svg" alt="" title=""></span>'
    ];
	$('#profile-carousel1').owlCarousel({
    margin:10,
    nav:true,
    dots: false,
    navText: navigation,
    responsive:{
      0:{
          items:5,          
      },
      768:{
          items:3
      },
      1200:{
          items:2
      }
    }
  });
$("#right-sidebar-menu .owl-item" ).css({"max-width": "50px", "width": "50px" });
  $("#right-sidebar-menu .item.active").closest(".owl-item").css({"max-width": "103px!important", "width": "103px!important" });
  
}
 

 
  $("#right-sidebar-menu .close-hambergmenu img").click(function() {
  	var window_height = window.outerHeight;
    $("#right-sidebar-menu").css({"height": window_height, "opacity": "0"} );  
    $("body").removeClass("noscroll");
    value = $('#right-sidebar-menu').css('width') === '250px' ? '0px' : '250px';
    var hide = $('#right-sidebar-menu').css('opacity') === 1 ? 0 : 1;
      $('#right-sidebar-menu').animate({
          width: value          
      }, 'fast');

      $('.user_menu').css("z-index", "1111");
  });   



$(".navbar-toggler-icon").click(function(){
	if(getShemarooCookies().user_id){
	var user_profiles = getShemarooCookies().user_profiles.split(",");
	console.log(user_profiles.length);
	var user_data = ""
	for(i=0;i< user_profiles.length;i++){
		var user_name = user_profiles[i].split("$")
		if(i == 1){
       	  user_data+= '<li class="active"><img src="/assets/profile.svg" alt="profile" title="profile"><p>'+user_name[1].substr(0,1).toUpperCase()+'</p><span class="text-uppercase">'+user_name[1]+'</span></li>'
		}
		else{
		  user_data+= '<li><p>'+user_name[1].substr(0,1).toUpperCase()+'</p><span class="text-uppercase">'+user_name[1]+'</span></li>'
		}
	}
	$("#mobile_user_profiles").html(user_data);
    $(".mobile_with_login").show();
    $(".mobile_with_out_login_item").hide();
   }
})
/*$(document).click(function(e) {
	$('.share_feature').hide();	
});*/
/*$('.share_social_icons').click(function(e) {
	$('.share_feature').toggle();
	//e.stopPropagation;
});
*/
});













