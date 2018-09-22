class SearchController < ApplicationController
 def index
  if params[:search].present?
  	 search_response = Ott.get_search_results(params[:search])
  	 #p search_response.inspect
  	 render :json => {:status => true,:results => search_response["data"]["items"]}
  end
 end
end
