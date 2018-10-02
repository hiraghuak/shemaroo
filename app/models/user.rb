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

	def self.sign_out(session_id)
      HTTP.post "users/#{session_id}/sign_out?region=#{$region}}" ,{},"user"
	end

	def self.sign_in(sign_in_params)
	 HTTP.post "users/sign_in?region=#{$region}",sign_in_params,"user"
	end
end