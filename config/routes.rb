Rails.application.routes.draw do

 root "catalogs#index"

 ##STATIC PAGES ROUTES STARTS HERE####
 get "/terms-and-conditions" => "statics#terms_conditions"

 get "/privacy-policy" => "statics#privacy_policy"

 get "/faq" => "statics#faq"

 get "/contact-us" => "statics#contact_us"

 ##STATIC PAGES ROUTES ENDS HERE####

 ##USERS PAGES ROUTES STARTS HERE####
 
	namespace :users do
	  get 'register'
	  get 'login'
	  post 'sign_in'
	  post 'sign_up'
	  get 'welcome'
	  post 'sign_out'
	  get  'verify_otp'
	  post 'validate_otp'
	  post 'resend_otp'
	  post 'forgot_password'
	  post 'subscriptions'
	end

 ##USERS PAGES ROUTES STARTS HERE####

 ##PLANS PAGES ROUTES STARTS HERE####
  get '/plans' => 'plans#all_plans'
  get '/plans/m_plans' => 'plans#mobile_plans'
  get '/plans/plans_summary' => 'plans#plans_summary'
  get '/plans/plans_purchase' => 'plans#plans_purchase'
  post '/plans/payment_url' => 'plans#payment_url'
  get '/plans/purchase_plans' => 'plans#purchase_plans'
  get '/payment/payment_processing' => 'plans#payment_processing'
  get '/payment/payment_success' => 'plans#payment_success'
  get '/payment/payment_failed' => 'plans#payment_failed'
  match 'plans/payment_response' => 'plans#payment_response', via: [:get, :post]
 ##PLANS PAGES ROUTES ENDS HERE####


 ###SEARCH ROUTES STARTS HERE#################
 match "/search" => "search#index",via: [:get,:post]
 get "/search/:search_item" => "search#index"

 ###SEARCH ROUTES ENDS HERE#################


 ##CATALOGS PAGES ROUTES STARTS HERE####
 get "/:catalog_name" => "catalogs#show_catalog_item"
 get "/:catalog_name/all" => "catalogs#all_items_list"
 get "/:catalog_name/:show_name" => "catalogs#item_details"
 get "/:catalog_name/others/all" => "catalogs#other_tvshows"
 get "/:catalog_name/:genre/all" => "catalogs#genre_all_items"
 get "/:catalog_name/:show_name/:item_name" => "catalogs#episode_details"
 ##CATALOGS PAGES ROUTES ENDS HERE####

end

