module ApplicationHelper

 def get_image_url(i,layout_type)
 	image_url = ""
   if layout_type == "t_16_9_banner"
   	 image_url = i["thumbnails"]["xl_image_16_5"]["url"]
   elsif layout_type == "t_2_3_movie" || layout_type == "t_2_3_movie_static" || layout_type == "movies"
   	 image_url = i["thumbnails"]["medium_2_3"]["url"] 
   elsif layout_type == "t_16_9_big" || layout_type == "t_16_9_epg" || layout_type == "t_1_1_play" || layout_type == "videos"
   	 image_url = i["thumbnails"]["medium_16_9"]["url"] if i["thumbnails"].has_key?("medium_16_9")
   elsif layout_type == "t_16_9_small"  || layout_type == "t_16_9_small_meta" || layout_type == "video"
      image_url = i["thumbnails"]["small_16_9"]["url"] if i["thumbnails"].has_key?("small_16_9")
   	elsif layout_type == "t_1_1_plain" 
   	  image_url = i["thumbnails"]["xl_image_1_1"]["url"] 	if i["thumbnails"].has_key?("xl_image_1_1")
    elsif layout_type == "t_comb_16_9_list" || layout_type == "t_16_9_big_meta" 
      image_url = i["thumbnails"]["large_16_9"]["url"] if i["thumbnails"].has_key?("large_16_9")
    elsif layout_type == "t_comb_1_1_image"
      image_url = i["thumbnails"]["small_16_9"]["url"] if i["thumbnails"].has_key?("small_16_9")
    elsif  layout_type == "t_1_1_album" || layout_type == "t_1_1_album_meta"
      image_url = i["thumbnails"]["medium_1_1"]["url"] 
   end
   return image_url
 end

 def get_item_color(item)
  begin
    color = ""
    config_resp = Rails.cache.fetch("design_configuration_list", expires_in: CACHE_EXPIRY_TIME) {
        Ott.get_configuration      
       }
     color = config_resp["data"]["params_hash2"]["config_params"]["layout_scheme"].collect{|x|"#"+x["start_color"]+"|"+"#"+x["end_color"] if (x["scheme"] == item)}.compact.first
     if color.nil?
     	color = "#8BC76D|#1F9FB9"
     end
  rescue
    Rails.cache.delete("design_configuration_list")
  end
  return color
 end

	def get_item_url(i)
		begin
			url  = ""
      if i["theme"] == "show" && i["subcategory_flag"] == "no"
        if i.has_key?("last_episode") && !i['last_episode'].blank?
          url = "/#{i['catalog_object']['friendly_id']}/#{i['last_episode']['show_object']['friendly_id']}"
        else
          url = "/#{i['catalog_object']['friendly_id']}/#{i['friendly_id']}"
        end
			else
			 url = "/#{i['catalog_object']['friendly_id']}/#{i['friendly_id']}"
			end
		 rescue
		  url = "/"
		 end
	return url
	end

  def get_meta_details
   title = "Shemaroo"
   description = "Shemaroo Entertainmenent"
   keywords = "Shemaroo"
   return title,description,keywords

  end

end
