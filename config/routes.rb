Rails.application.routes.draw do

 root "catalogs#index"

 ##STATIC PAGES ROUTES STARTS HERE####
 get "/terms-and-conditions" => "statics#terms_conditions"

 get "/privacy-policy" => "statics#privacy_policy"

 get "/faq" => "statics#faq"

 get "/contact-us" => "statics#contact_us"
 ##STATIC PAGES ROUTES ENDS HERE####

 ##USERS PAGES ROUTES STARTS HERE####
 get "/users/my_account" => "users#my_account"

 get "/users/register" => "users#register"

 get "/users/login" => "users#login"

 get "/users/forgot_password" => "users#forgot_password"


 get "/users/subscriptions" => "users#subscriptions"

 ##USERS PAGES ROUTES STARTS HERE####

 ##PLANS PAGES ROUTES STARTS HERE####
 get "/plans" => "plans#index"
 ##PLANS PAGES ROUTES STARTS HERE####


 ###SEARCH ROUTES STARTS HERE#################
 match "/search" => "search#index",via: [:get,:post]
 get "/search/:search_item" => "search#index"

 ###SEARCH ROUTES ENDS HERE#################


 ##CATALOGS PAGES ROUTES STARTS HERE####
 get "/:catalog_name" => "catalogs#show_catalog_item"
 get "/:catalog_name/all" => "catalogs#all_items_list"
 get "/:catalog_name/:show_name" => "catalogs#item_details"
 get "/:catalog_name/:genre/all" => "catalogs#genre_all_items"
 get "/:catalog_name/:show_name/:item_name" => "catalogs#episode_details"
 ##CATALOGS PAGES ROUTES ENDS HERE####

end

