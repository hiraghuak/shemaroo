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

  def all_items_list
    begin
      response = Rails.cache.fetch("all_items_list_#{params[:catalog_name]}", expires_in: CACHE_EXPIRY_TIME){
       Ott.get_items_list(params[:catalog_name])
      }
      @all_items = response["data"]["catalog_list_items"]
      @layout_type =  response["data"]["layout_type"]
      @title = response["data"]["display_title"] 
    rescue
     Rails.cache.delete("all_items_list_#{params[:catalog_name]}")
     @all_items = []
    end
  end

  def item_details
     begin
      item_response = Rails.cache.fetch("item_details_#{params[:catalog_name]}_#{params[:item_name]}", expires_in: CACHE_EXPIRY_TIME){
       Ott.get_items_details(params[:catalog_name],params[:item_name])
      }
      @item_details = item_response["data"]
      url = sign_smarturl item_response["data"]['play_url']['saranyu']['url']
      @play_url = url['playback_urls'][0]["playback_url"]
      @new_play_url,@key =  encrypt_play_url(@play_url)
    rescue
     Rails.cache.delete("item_details_#{params[:catalog_name]}_#{params[:item_name]}")
     @details = []
    end
  end

  def episode_details
     begin
      response = Rails.cache.fetch("item_details_#{params[:catalog_name]}_#{params[:show_name]}_#{params[:item_name]}", expires_in: CACHE_EXPIRY_TIME){
       Ott.get_episode_details(params[:catalog_name],params[:show_name],params[:item_name])
      }
      @epsiode_details = response["data"]
      url = sign_smarturl response["data"]['play_url']['saranyu']['url']
      @play_url = url['playback_urls'][0]["playback_url"]
      @new_play_url,@key =  encrypt_play_url(@play_url)
    rescue
     Rails.cache.delete("item_details_#{params[:catalog_name]}_#{params[:show_name]}_#{params[:item_name]}")
     @epsiode_details = []
    end

  end



private

  def encrypt_play_url(url)
    new_url = ""
    aes = OpenSSL::Cipher::Cipher.new('AES-128-CBC')
    aes.encrypt
    key = aes.random_key
    aes.key = key
    e_key = Base64.encode64(key).gsub(/\n/, '')
    encrypted = aes.update(url) + aes.final
    new_url = Base64.encode64(encrypted).gsub(/\n/, '')
    return new_url,e_key
  end


end
