class User
	def self.sign_up(sign_up_params)
	 HTTP.post "users?region=#{$region}", sign_up_params,"user"
	end

	def self.sign_in(sign_in_params)
	 HTTP.post "users/sign_in?region=#{$region}",sign_in_params,"user"
	end

	def self.verify_otp(otp)
	  HTTP.get "users/verification/#{otp}?region=#{$region}","user"
	end

	def self.resend_otp(resend_params)
	  HTTP.post "users/resend_verification_link",resend_params,"user"
	end

	def self.get_all_user_profiles(session_id)
       HTTP.get "users/#{session_id}/profiles?region=#{$region}","user"
	end

	def self.get_user_profile(profile_id,session_id)
       HTTP.get "users/#{session_id}/profiles/#{profile_id}?region=#{$region}","user"
	end

	def self.sign_out(session_id)
      HTTP.post "users/#{session_id}/sign_out?region=#{$region}" ,{},"user"
	end

	def self.sign_in(sign_in_params)
	 HTTP.post "users/sign_in?region=#{$region}",sign_in_params,"user"
	end

	def self.get_user_account_details(session_id)
      HTTP.get "users/#{session_id}/account?region=#{$region}","user"
	end

	def self.update_profile(session_id,profile_id,profile_params)
     HTTP.put "users/#{session_id}/profiles/#{profile_id}?region=#{$region}",profile_params,"user"
    end

    def self.delete_profile(session_id,profile_id)
     HTTP.delete "users/#{session_id}/profiles/#{profile_id}?region=#{$region}","user"
    end

    def self.update_account_details(session_id,user_data)
      HTTP.put "users/#{session_id}/account?region=#{$region}",user_data,"user"
    end

    def self.add_profile(session_id,profile_data)
      HTTP.post "users/#{session_id}/profiles?region=#{$region}",profile_data,"user"
    end

    def self.assign_profile(session_id,user_profile_data)
      HTTP.post "users/#{session_id}/assign_profile?region=#{$region}",user_profile_data,"user"	
    end

end
