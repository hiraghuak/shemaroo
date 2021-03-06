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
    @meta_title = response["data"]["display_title"]
    @meta_keywords = ""
    @layout_scheme = response["data"]["layout_scheme"]
    # subscribe_item = response["data"]["catalog_list_items"].collect{|x| x if(x["layout_type"] == "t_subscription")}.compact.first
    # @subscribe_img = subscribe_item["list_item_object"]["banner_image"]
    # @plan_det = subscribe_item["catalog_list_items"][0]["plans"].first
   rescue Exception => e
    redirect_to "#{SITE}/500"
      logger.info e.message
     Rails.cache.delete("catalog_item_list_#{params[:catalog_name]}")
     @items_list = []
    end
  end

  def all_items_list
    begin
    # next_page = "true"
    # page_size = 20
    # if params[:page_no].present?
    #   page_number = params[:page_no].to_i
    # else
    #   page_number = 0
    # end
      # response = Rails.cache.fetch("all_items_list_#{params[:catalog_name]}_#{page_number}", expires_in: CACHE_EXPIRY_TIME){
      #  Ott.get_items_list_with_pagination(params[:catalog_name],page_number,page_size)
      # }
      response = Rails.cache.fetch("all_items_list_#{params[:catalog_name]}", expires_in: CACHE_EXPIRY_TIME){
       Ott.get_items_list(params[:catalog_name])
      }
      @all_items = response["data"]["catalog_list_items"]
      @layout_type =  response["data"]["layout_type"]
      @layout_scheme = response["data"]["layout_scheme"]
      @title = response["data"]["display_title"]
      @next_page = true
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
        @layout_scheme = item_response["data"]["catalog_object"]["layout_scheme"]
        @episode_details = item_response["data"]
        p @episode_details['item_caption'].inspect
        @image_url = @episode_details["thumbnails"]['large_16_9']['url']
        tvshow_response =  Rails.cache.fetch("all_epsiodes_#{params[:catalog_name]}_#{params[:show_name]}", expires_in: CACHE_EXPIRY_TIME){
         Ott.get_all_epsiodes(params[:catalog_name],params[:show_name])
        }
        @all_episodes = tvshow_response["data"]["items"]
        catalog_response = Rails.cache.fetch("more_details_#{params[:catalog_name]}", expires_in: CACHE_EXPIRY_TIME){
         Ott.get_catalog_details(params[:catalog_name])
        }
        if @all_episodes.count > 0
          @new_play_url,@key =  get_play_url_key(@all_episodes.first)
        else
          @new_play_url,@key = ""
        end
        @other_items = catalog_response["data"]["items"]
        @catalog_name = catalog_response["data"]["name"]
        @tvshow_name = item_response["data"]["title"]
        render "episode_details"
      else
        @item_details = item_response["data"]
        @theme = item_response["data"]["theme"]
        if @theme == "linear"
          programs_response = Ott.get_channel_programs(params[:catalog_name],params[:show_name])
          @channel_all_programs = programs_response["data"]["items"]
          channels_response = Ott.get_all_channels
          @all_channels = channels_response["data"]["items"]
        end
        @new_play_url,@key =  get_play_url_key(item_response['data'])
        more_item_response = Rails.cache.fetch("more_items_#{params[:catalog_name]}_#{@item_details['genres'][0]}", expires_in: CACHE_EXPIRY_TIME){
         Ott.get_items_genre(params[:catalog_name],@item_details['genres'][0])
       }
       @layout_scheme = item_response["data"]["catalog_object"]["layout_scheme"]
       @genere_items = more_item_response["data"]["items"]
       @layout_type = item_response["data"]["catalog_object"]["layout_type"]
      end
    rescue Exception => e
      redirect_to "#{SITE}/500"
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
      @layout_scheme = response["data"]["catalog_object"]["layout_scheme"]
      @new_play_url,@key =  get_play_url_key(response["data"])
      tvshow_response =  Rails.cache.fetch("all_epsiodes_#{params[:catalog_name]}_#{params[:show_name]}", expires_in: CACHE_EXPIRY_TIME){
         Ott.get_all_epsiodes(params[:catalog_name],params[:show_name])
        }
      @all_episodes = tvshow_response["data"]["items"]
      catalog_response = Rails.cache.fetch("more_details_#{params[:catalog_name]}", expires_in: CACHE_EXPIRY_TIME){
         Ott.get_catalog_details(params[:catalog_name])
        }
      @other_items = catalog_response["data"]["items"]
      @catalog_name = catalog_response["data"]["name"]
      @tvshow_name = response["data"]["show_name"]
      @layout_type = catalog_response["data"]["catalog_object"]["layout_type"]
    rescue Exception => e
      redirect_to "#{SITE}/500"
      logger.info e.message
     Rails.cache.delete("item_details_#{params[:catalog_name]}_#{params[:show_name]}_#{params[:item_name]}")
     @epsiode_details = []
    end

  end

  def genre_all_items
   begin
      items_response = Rails.cache.fetch("all_items_#{params[:catalog_name]}_#{params[:genre]}", expires_in: CACHE_EXPIRY_TIME){
         Ott.get_items_genre(params[:catalog_name],params[:genre])
       }
    @all_genere_items = items_response["data"]["items"]
    @theme = items_response["data"]["theme"]
    @layout_scheme =  items_response["data"]["catalog_object"]["layout_scheme"]
   rescue Exception => e
    logger.info e.message
    @all_genere_items = []
     Rails.cache.delete("all_items_#{params[:catalog_name]}_#{params[:genre]}")
   end
  end

  def other_tvshows
   begin 
    items_response = Rails.cache.fetch("other_tvshows_#{params[:catalog_name]}", expires_in: CACHE_EXPIRY_TIME){
         Ott.get_catalog_details_with_pagination(params[:catalog_name])
       }
    @title = "Other  "+items_response["data"]["name"]
    @all_tvshows = items_response["data"]["items"]
    @layout_scheme =  items_response["data"]["catalog_object"]["layout_scheme"]
    rescue
      Rails.cache.delete("other_tvshows_#{params[:catalog_name]}")
      @all_tvshows = []
    end
  end
  
  def all_episodes
    next_page = "true"
    if params[:page_no].present?
     page_number = params[:page_no].to_i
    else
     page_number = 0
    end
    response = Ott.get_all_epsiodes_with_pagination(params[:catalog_name],params[:show_name],page_number)
    no_of_pages = response["data"]["total_items_count"]/10.round
    items =  response["data"]["items"].collect{|x|x["title"]+"$"+x["thumbnails"]["small_16_9"]["url"]+"$"+get_duration_time(x['duration_string']) +"$"+"/"+params[:catalog_name]+"/"+params[:show_name]+"/"+x["friendly_id"]+"$"+x['episode_number']}
    if page_number+1 > no_of_pages
     next_page = "false"
    end
    render :json => {:status => true,:episodes => items,:next_page => next_page,:pageno => page_number+1}
  end

  def all_channels
   begin 
    channels_response = Rails.cache.fetch("all_channels", expires_in: CACHE_EXPIRY_TIME){
         Ott.get_all_channels
       }
     @all_channels = channels_response["data"]["catalog_list_items"]
    rescue
      Rails.cache.delete("all_channels")
      @all_channels = []
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

  def get_play_url_key(response)
    url = sign_smarturl response['play_url']['saranyu']['url']
    if response["theme"] == "live"
       play_url = url["adaptive_urls"][0]['playback_url']
    else
      play_url = url["adaptive_urls"].collect{|x|x["playback_url"] if x["label"] == "laptop_free_#{$region.downcase}_logo"}.compact.first
      play_url = url["adaptive_urls"].collect{|x|x["playback_url"] if x["label"] == "laptop_free_in"}.compact.first if play_url.nil?
    end
    if play_url.nil?
      new_play_url = ""
    else
      new_play_url = encrypt_play_url(play_url)
    end
    return new_play_url
  end


end
