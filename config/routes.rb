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

 get "/users/register" => "users#sign_up"

 get "/users/login" => "users#sign_in"

 get "/users/subscriptions" => "users#subscriptions"

 ##USERS PAGES ROUTES STARTS HERE####

 ##PLANS PAGES ROUTES STARTS HERE####
 get "/plans" => "plans#index"
 ##PLANS PAGES ROUTES STARTS HERE####

 ##CATALOGS PAGES ROUTES STARTS HERE####
 get "/:catalog_name" => "catalogs#show_catalog_item"
 ##CATALOGS PAGES ROUTES ENDS HERE####

end

