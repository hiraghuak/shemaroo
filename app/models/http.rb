require 'resterror'
class HTTP

	def self.post url, data,type
		url = set_url(url,type)
		response = Typhoeus::Request.post(url, :body => data.to_json,:headers => http_headers)
		check_error(response)
	end

	
	def self.get url,type
	    url = set_url(url,type)
	    Rails.logger.info url
		response = Typhoeus::Request.get(url,:headers => http_headers,:connecttimeout =>10,:timeout => 40)
		check_error(response) 
	end


	def self.put url, data,type
		url = set_url(url,type)
		response = Typhoeus::Request.put(url, :body => data.to_json,:headers => http_headers)
		check_error(response)
	end
	
	def self.delete url,type
		url = set_url(url,type)
	    Rails.logger.info url
		response = Typhoeus::Request.delete(url,:headers => http_headers,:connecttimeout =>10,:timeout => 40)
		check_error(response) 
	end

	def self.http_headers
		{ "Content-Type" => "application/json", "Accept"=>"application/json" }
	end 

   	def self.set_url(url,type)
   		 server_url = get_url(type)
   		 if type == "livetv"
   		 	token = LIVETV_TOKEN
   		 else 
   		 	token = AUTH_TOKEN
   		 end
	    if url.include? "?"
			url = "#{server_url}/#{url}&auth_token=#{token}" 
		else
			url = "#{server_url}/#{url}?auth_token=#{token}"
	    end
	    return url
   	end


  def self.get_url(type)
  	server_url = ""

  	# case type
	  # 	when "user"
	  # 	 	server_url = USER_API_SERVER
	  # 	when "catalog"
	  # 	 	server_url = CATALOG_API_SERVER
  	#  	when "search"
  	#  		server_url = SEARCH_API_SERVER
	  # 	when "services"
	  # 		server_url = API_SERVER
	  # 	when "livetv"
	  # 		server_url = LIVETV_API_SERVER
	  #   end
    return API_SERVER
  end

	def self.check_error(response)
		case response.code 
			when 200
				return JSON.parse(response.body)
			when 422
				return JSON.parse(response.body)
			when 404
				raise RESTError.new(response.code), JSON.parse(response.body)
			else 
				raise RESTError.new(response.code), JSON.parse(response.body)
		end
	end
end	