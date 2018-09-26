class ApplicationController < ActionController::Base
protect_from_forgery unless: -> { request.format.json? }

before_action :get_home_tabs,:get_region


def get_home_tabs
  resp = Ott.get_home_tabs
  @header_tabs = resp["data"]["catalog_list_items"] 
end


#get the user region based on ip address
  def get_region
    begin
        if Rails.env == "development"
          @region = "IN"
          $region = @region
        else
          ip = get_user_ip
          response = Ott.get_user_region(ip)
          @region = response["region"]["country_code2"]
          $region = @region
        end
    rescue
      @region = "IN"
      $region = @region
    end
  end
end
