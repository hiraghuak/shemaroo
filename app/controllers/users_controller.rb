class UsersController < ApplicationController
 
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
	  set_response(response)
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
   else
      signin_params[:user][:email_id] = params[:email_id]
   end
   sign_in_response = User.sign_in(signin_params)
   p sign_in_response.inspect
   if sign_in_response.has_key?("data")
    user_profiles = User.get_all_user_profiles(sign_in_response["data"]["session"])
    all_profiles = user_profiles['data']['profiles'].collect{|x|[x['profile_id']+"$"+x['firstname']]}.compact
    first_profile = all_profiles.flatten.first.split("$")
    render json: {status: true,user_id: "#{sign_in_response["data"]["session"]}",user_name: first_profile[1],user_profiles: all_profiles,profile_id: first_profile[0] }
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
   	all_profiles = user_profiles['data']['profiles'].collect{|x|[x['profile_id']+"$"+x['firstname']]}.compact
   	first_profile = all_profiles.first.split("$")
   	render json: {status: true,user_id: "#{response["data"]["messages"][0]["session"]}",user_name: first_profile[1],user_profiles: all_profiles,profile_id: first_profile[0] }
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
      send_exception_mail(e)
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
