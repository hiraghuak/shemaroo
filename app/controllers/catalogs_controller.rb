class CatalogsController < ApplicationController
  def index
  	begin
  	response = Rails.cache.fetch("home_page_list", expires_in: CACHE_EXPIRY_TIME) {
      Ott.get_home_list      
     }
  	 @home_list = response["data"]["catalog_list_items"]
  	 @items = @home_list.drop(1)
  	rescue Exception => e
      logger.info e.message
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
    @catalog_items = @items_list.drop(1)
    subscribe_item = response["data"]["catalog_list_items"].collect{|x| x if(x["layout_type"] == "t_subscription")}.compact.first
    @subscribe_img = subscribe_item["list_item_object"]["banner_image"]
    @plan_det = subscribe_item["catalog_list_items"][0]["plans"].first
   rescue Exception => e
      logger.info e.message
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
    rescue Exception => e
      logger.info e.message
     Rails.cache.delete("all_items_list_#{params[:catalog_name]}")
     @all_items = []
    end
  end

  def item_details
     begin
       item_response = Rails.cache.fetch("item_details_#{params[:catalog_name]}_#{params[:show_name]}", expires_in: CACHE_EXPIRY_TIME){
         Ott.get_items_details(params[:catalog_name],params[:show_name])
        }
      if item_response["data"].has_key?("episode_flag")
        @episode_details = item_response["data"]
        @image_url = @episode_details["thumbnails"]['large_16_9']['url']
        tvshow_response =  Rails.cache.fetch("all_epsiodes_#{params[:catalog_name]}_#{params[:show_name]}", expires_in: CACHE_EXPIRY_TIME){
         Ott.get_all_epsiodes(params[:catalog_name],params[:show_name])
        }
        @all_episodes = tvshow_response["data"]["items"]
        render "episode_details"
      else
        @item_details = item_response["data"]
        url = sign_smarturl item_response["data"]['play_url']['saranyu']['url']
        @play_url = url['playback_urls'][0]["playback_url"]
        @new_play_url,@key =  encrypt_play_url(@play_url)
        more_item_response = Rails.cache.fetch("more_items_#{params[:catalog_name]}_#{@item_details['genres'][0]}", expires_in: CACHE_EXPIRY_TIME){
         Ott.get_items_genre(params[:catalog_name],params[:show_name],@item_details['genres'][0])
       }
       @genere_items = more_item_response["data"]["items"]
      end
    rescue Exception => e
      logger.info e.message
      Rails.cache.delete("item_details_#{params[:catalog_name]}_#{params[:show_name]}")
      @item_details = []
    end
  end

  def episode_details
     begin
      response = Rails.cache.fetch("item_details_#{params[:catalog_name]}_#{params[:show_name]}_#{params[:item_name]}", expires_in: CACHE_EXPIRY_TIME){
       Ott.get_episode_details(params[:catalog_name],params[:show_name],params[:item_name])
      }
      @episode_details = response["data"]
      url = sign_smarturl response["data"]['play_url']['saranyu']['url']
      @play_url = url['playback_urls'][0]["playback_url"]
      @new_play_url,@key =  encrypt_play_url(@play_url)
      tvshow_response =  Rails.cache.fetch("all_epsiodes_#{params[:catalog_name]}_#{params[:show_name]}", expires_in: CACHE_EXPIRY_TIME){
         Ott.get_all_epsiodes(params[:catalog_name],params[:show_name])
        }
      @all_episodes = tvshow_response["data"]["items"]
    rescue Exception => e
      logger.info e.message
     Rails.cache.delete("item_details_#{params[:catalog_name]}_#{params[:show_name]}_#{params[:item_name]}")
     @epsiode_details = []
    end

  end




private

  def get_all_catalogs
   response = Ott.get_all_catalogs
  end

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
