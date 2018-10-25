class UsersController < ApplicationController
 #skip_before_action  :verify_authenticity_token
 before_action :check_valid_user,:only => ["edit_profile","manage_profiles","account_details"]
 def sign_up
	 begin
	  signup_params = {
	    :user => {
	    :firstname=> params[:name],
	    :password => params[:password],
	    :region => $region
	    }
	  }
	  if $region == "IN"
	    signup_params[:user][:user_id] = "91"+params[:mobileno]
	    signup_params[:user][:type] = "msisdn"

	  else
	    signup_params[:user][:email_id] = params[:email_id]
	  end
	  response = User.sign_up(signup_params)
    p response.inspect
    if $region != "IN" && response.has_key?("data")
    user_profiles = User.get_all_user_profiles(response["data"]["session_id"])
    all_profiles = user_profiles['data']['profiles'].collect{|x|[x['profile_id']+"$"+x['firstname']]}.compact.flatten
    first_profile = all_profiles.flatten.first.split("$")
    render json: {status: true,user_id: "#{response["data"]["session_id"]}",user_name: first_profile[1],user_profiles: all_profiles,profile_id: first_profile[0] }
   else
    set_response(response)
   end
	rescue Exception => e
	  logger.info e.message
	end
 end


 def sign_in
  begin
   signin_params = {
    :user => {
      :password => params[:password],
      :region => $region
    }
   }
   if $region == "IN"
      signin_params[:user][:user_id] = "91"+params[:mobile_no]
      signin_params[:user][:type] = "msisdn"
      user_login_id = "91"+params[:mobile_no] 
   else
      signin_params[:user][:email_id] = params[:email_id]
      user_login_id = params[:email_id]
   end
   sign_in_response = User.sign_in(signin_params)
   if sign_in_response.has_key?("data")
    user_profiles = User.get_all_user_profiles(sign_in_response["data"]["session"])
    all_profiles = user_profiles['data']['profiles'].collect{|x|[x['profile_id']+"$"+x['firstname']]}.compact.flatten
    first_profile = all_profiles.flatten.first.split("$")
    render json: {status: true,user_id: "#{sign_in_response["data"]["session"]}",user_name: first_profile[1],user_profiles: all_profiles,profile_id: first_profile[0],login_id: user_login_id}
   else
    set_response(sign_in_response)
   end
  rescue Exception => e
    render json: {status: false,error_message: "sorry something went wrong" }
    logger.info e.message
  end

 end



 def verify_otp
 
 end

 def welcome

 end

 def validate_otp
 	begin
   response = User.verify_otp(params[:otp])
   if response.has_key?("data")
   	user_profiles = User.get_all_user_profiles(response["data"]["messages"][0]["session"])
   	all_profiles = user_profiles['data']['profiles'].collect{|x|[x['profile_id']+"$"+x['firstname']]}.compact.flatten
    first_profile = all_profiles.first.split("$")
     user_login_profile =  User.get_user_account_details(response["data"]["messages"][0]["session"])
     if user_login_profile["data"]["login_type"] == "msisdn"
       login_id = user_login_profile["data"]["mobile_number"]
     else
        login_id = user_login_profile["data"]["email_id"]
      end
   	render json: {status: true,user_id: "#{response["data"]["messages"][0]["session"]}",user_name: first_profile[1],user_profiles: all_profiles,profile_id: first_profile[0],:login_id => login_id }
   else
    set_response(response)
   end
   rescue Exception => e
    render json: {status: false,error_message: "sorry something went wrong" }
	  logger.info e.message
	end
 end

 def resend_otp
  begin
  	 resend_params = {
	    :user => {
	    :email_id=> params[:mobile_no],
	    :type => "msisdn"
	    }
	  }
   response = User.resend_otp(resend_params) 
   set_response(response)
   rescue Exception => e
	  logger.info e.message
	end
 end

 def sign_out
 	begin
    response = User.sign_out(cookies[:user_id])
    rescue Exception => e
      logger.info e.message
    end
    render json: {error_message: "",status: true }
 end


def login
 if cookies[:user_id].present?
  redirect_to "#{SITE}"
 end
end

def register
 if cookies[:user_id].present?
  redirect_to "#{SITE}"
 end
end


 def my_account

 end

 def subscriptions

 end

 def edit_profile
  user_profile = User.get_user_profile(params[:profile_id],cookies[:user_id])
  @edit_profile = user_profile["data"]["profile"]
 end

def manage_profiles
  profile_response = User.get_all_user_profiles(cookies[:user_id])
  @user_profiles = profile_response["data"]["profiles"]

end

def account_details
  user_details_resp = User.get_user_account_details(cookies[:user_id])
  @user_details = user_details_resp["data"]
end

def update_profile
  begin
    update_profile_params = {
      :user_profile => {
      :firstname => params[:name],
      :child => params[:is_child]
     }
  }
  update_profile_response = User.update_profile(cookies[:user_id],params[:profileid],update_profile_params)
    render json: {:status => true}
  rescue
    render json: {:status => false,:error_message => "sorry something went wrong"}
  end
end

def delete_profile
  begin
  delete_profile_response = User.delete_profile(cookies[:user_id],params[:profileid])
    render json: {:status => true}
  rescue
    render json: {:status => false,:error_message => "sorry something went wrong"}
  end
end

def update_personal_details
  if request.xhr?
    user_params = {
      :user => {
        :firstname => params[:profile_name],
        :mobile_number => cookies[:user_login_id]
      }
    }
    update_user_resp = User.update_account_details(cookies[:user_id],user_params)
    render json: {:status => true}
  else
    user_details_resp = User.get_user_account_details(cookies[:user_id])
    @user_profile_details = user_details_resp["data"]
 end
end

def add_profile
  if request.xhr?
    profile_params = {
      :user_profile => {
        :firstname => params[:profile_name],
        :child => params[:kids_profile]
      }
    }
    profile_resp = User.add_profile(cookies[:user_id],profile_params)
    render json: {:status => true}
  end
end


def check_valid_user
  unless cookies[:user_id].present?
    redirect_to "#{SITE}"
  end
end

 private

   def set_response(response)
    if response.has_key?('error')
      if response['error']['message']['email_id'] == "has already been taken"
        render json: {error_message: "Email Id has already registered",status: false}
      else
        render json: {error_message: "#{response['error']['message']}",status: false }
      end
    else
      if response.has_key?("data") && response["data"]["session"]
        render json: {error_message: "#{response['data']['message'] if response.has_key?("data")}",status: true,user_id: "#{response["data"]["session"]}",user_name: "#{response["data"]["firstname"]}"}
      else
       render json: {error_message: "#{response['data']['message'] if response.has_key?("data")}",status: true }
      end
    end
  end
  
end
