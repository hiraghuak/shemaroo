class CatalogsController < ApplicationController
  def index
  	begin
  	response = Rails.cache.fetch("home_page_list", expires_in: CACHE_EXPIRY_TIME) {
      Ott.get_home_list      
     }
  	 @home_list = response["data"]["catalog_list_items"]
  	 @items = @home_list.drop(1)
  	rescue
  	 Rails.cache.delete("home_page_list")
  	 @home_list = []
    end 
  end

  def show_catalog_item
   begin
    response = Rails.cache.fetch("catalog_item_list_#{params[:catalog_name]}", expires_in: CACHE_EXPIRY_TIME){
     Ott.get_items_list(params[:catalog_name])
    }
    @items_list = response["data"]["catalog_list_items"]
    @catalog_items = @items_list.drop(2)
   rescue
     Rails.cache.delete("catalog_item_list_#{params[:catalog_name]}")
     @items_list = []
    end
  end



end
