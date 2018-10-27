Rails.application.routes.draw do

 root "catalogs#index"

 ##STATIC PAGES ROUTES STARTS HERE####
 get "/terms-and-conditions" => "statics#terms_conditions"

 get "/privacy-policy" => "statics#privacy_policy"

 get "/content_not_available" => "statics#content_not_available"

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
    get 'manage_profiles'
    get 'account_details'
    get 'forgot_password'
    get 'watch_list'
    get 'change_password'
    get 'change_profile'
	  post 'sign_out'
	  get  'verify_otp'
    post 'update_profile'
    post 'delete_profile'
    match  'update_personal_details',via: [:get,:post]
    match  'add_profile',via: [:get,:post]
	  post 'validate_otp'
	  post 'resend_otp'
	  post 'subscriptions'
	end
  get "/users/edit_profile/:profile_id" => "users#edit_profile"
  get "/users/remote_profile/:profile_id" => "users#remote_profile"

 ##USERS PAGES ROUTES STARTS HERE####

 ##PLANS PAGES ROUTES STARTS HERE####
  get '/plans' => 'plans#all_plans'
  get '/plans/m_plans' => 'plans#mobile_all_plans'
 
  get '/plans/plans_summary' => 'plans#plans_summary'
  get '/plans/m_plans_summary' => 'plans#mobile_plans_summary'
 
  get '/plans/plans_purchase' => 'plans#plans_purchase'
  get '/plans/m_plans_purchase' => 'plans#mobile_plans_purchase'
 
  post '/plans/payment_url' => 'plans#payment_url'
  post '/plans/m_payment_url' => 'plans#mobile_payment_url'

  get '/plans/purchase_plans' => 'plans#purchase_plans'
  get '/plans/m_purchase_plans' => 'plans#mobile_purchase_plans'
 
  get '/payment/payment_processing' => 'plans#payment_processing'
  get '/payment/m_payment_processing' => 'plans#mobile_payment_processing'
 
  get '/payment/payment_success' => 'plans#payment_success'
  get '/payment/m_payment_success' => 'plans#mobile_payment_success'
 
  get '/payment/payment_failed' => 'plans#payment_failed'
  get '/payment/m_payment_failed' => 'plans#mobile_payment_failed'
 
  post '/payment/payment_canceled' => 'plans#payment_canceled'
  post '/payment/m_payment_canceled' => 'plans#mobile_payment_canceled'
 
  # post '/payment/payment_response' => 'plans#payment_response'
  # post '/payment/m_payment_response' => 'plans#mobile_payment_response'
 
  match 'payment/payment_response' => 'plans#payment_response', via: [:get, :post]
  match 'payment/m_payment_response' => 'plans##mobile_payment_response', via: [:get, :post]
 
  get '/plans/apply_promocode' => 'plans#apply_promocode'
  # get '/plans/m_apply_promocode' => 'plans##mobile_apply_promocode'

  get '/plans/view_plans' => 'plans#view_plans'
  get '/plans/m_view_plans' => 'plans##mobile_view_plans'

  get '/plans/plan_details/:id', to: 'plans#plan_details', as: 'plan'
  get '/plans/m_plan_details/:plan_id' => 'plans##mobile_plan_details'

   get '/plans/modify_plans' => 'plans#modify_plans'
  get '/plans/m_modify_plans' => 'plans##mobile_modify_plans'

 ##PLANS PAGES ROUTES ENDS HERE####


 ###SEARCH ROUTES STARTS HERE#################
 match "/search" => "search#index",via: [:get,:post]
 # get "/search" => "search#index"

 ###SEARCH ROUTES ENDS HERE#################


 ##CATALOGS PAGES ROUTES STARTS HERE####
 get "/:catalog_name" => "catalogs#show_catalog_item"
 get "/:catalog_name/all" => "catalogs#all_items_list"
 get "/:catalog_name/:show_name" => "catalogs#item_details"
 get "/:catalog_name/others/all" => "catalogs#other_tvshows"
 get "/:catalog_name/:show_name/all_episodes" => "catalogs#all_episodes"
 get "/:catalog_name/:genre/all" => "catalogs#genre_all_items"
 get "/:catalog_name/:show_name/:item_name" => "catalogs#episode_details"
 ##CATALOGS PAGES ROUTES ENDS HERE####

end

