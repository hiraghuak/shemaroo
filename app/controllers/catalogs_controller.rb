class CatalogsController < ApplicationController
  def index
  	begin
  	response = Rails.cache.fetch("home_page_list", expires_in: CACHE_EXPIRY_TIME) {
      Ott.get_channel_programs(catalog_id.api_id,slug.api_id)
      }
  	 response = Ott.get_home_list
  	 @home_list = response["data"]["catalog_list_items"]
  	 @items = @home_list.drop(1)
  	rescue
  	Rails.cache.delete("home_page_list")
  	 @home_list = []
    end 
  end

  def show_catalog_item
  	#response = Ott.
  end
end
