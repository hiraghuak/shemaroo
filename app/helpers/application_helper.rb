module ApplicationHelper

 def get_image_url(i,layout_type)
 	image_url = ""
   if layout_type == "t_16_9_banner"
   	 #image_url = i["thumbnails"]["xl_image_16_9"]["url"]
   	 image_url = i["thumbnails"]["xl_image_16_5"]["url"]
   elsif layout_type == "t_2_3_movie"
   	 image_url = i["thumbnails"]["large_2_3"]["url"] 
   elsif layout_type == "t_16_9_big"
   	 image_url = i["thumbnails"]["medium_16_9"]["url"] 
   	elsif layout_type == "t_2_3_movie_static"
   	  image_url = i["thumbnails"]["xl_image_2_3"]["url"] 
   	elsif layout_type == "t_1_1_plain"
   	  image_url = i["thumbnails"]["xl_image_1_1"]["url"] 	
   end
   return image_url
 end

 def get_item_color(item)
  color = ""
  config_resp = Ott.get_configuration
  color = config_resp["data"]["params_hash2"]["config_params"]["layout_scheme"].collect{|x|"#"+x["start_color"]+"$"+"#"+x["end_color"] if (x["scheme"] == item)}.compact.first
   if color.nil?
   	color = "#8BC76D$#1F9FB9"
   end
   p color.inspect
  return "background: linear-gradient(to right,#{color.split("$")[0]}, #{color.split("$")[1]}) !important;"
 end

	def get_item_url(i)
		begin
			url  = ""
			if i["subcategory_flag"] == "yes" || i["episode_flag"] == "yes"
			 url = "#"
			else
			 url = "/#{i['catalog_object']['friendly_id']}/#{i['friendly_id']}"
			end
		rescue
		 url = "#"
		end
	return url
	end

end
