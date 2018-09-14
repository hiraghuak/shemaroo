module ApplicationHelper

 def get_image_url(i,layout_type)
 	image_url = ""
   if layout_type == "t_16_9_banner"
   	 image_url = i["thumbnails"]["xl_image_16_9"]["url"]
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

end
