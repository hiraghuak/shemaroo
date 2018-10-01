class User
  def self.sign_up(sign_up_params)
      HTTP.post "users?region=#{$region}", sign_up_params,"user"
    end
    
    def self.sign_in(sign_in_params)
      HTTP.post "users/sign_in?region=#{$region}",sign_in_params,"user"
    end
end