class SearchController < ApplicationController
 def index
  #begin
	  @search_results = []
	  if params[:search].present?
	  	 search_response = Ott.get_search_results(params[:search])
	  	 render :json => {:status => true,:results => search_response["data"]["items"].collect{|x|x["thumbnails"]["medium_16_9"]["url"]+"$"+x["title"].capitalize+"$"+ x["theme"].capitalize+"$"+x["language"].capitalize+"$"+x["genres"][0].capitalize+"$"+get_item_url(x)}}
	  elsif params[:q].present?
	     search_response = Ott.get_search_results(params[:q])
	     @search_results =  search_response["data"]["items"]
	  end
	 # rescue
	 # 	@search_results = []
	 # end
  end
end
