class CatalogsController < ApplicationController
  def index
  	begin
  	 response = Ott.get_home_list
  	 @home_list = response["data"]["catalog_list_items"]
  	 @items = @home_list.drop(1)
  	rescue
  		@home_list = []
    end 
  end
end
