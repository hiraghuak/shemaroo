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

 	render :json => {:status => true}

 end



 def verify_otp
 
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
