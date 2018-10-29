class Ott
  
 def self.get_configuration
  HTTP.get "catalogs/message/items/app-config-params?region=#{$region}","catalog"
 end

 def self.get_home_list
  HTTP.get "catalog_lists/homepage-list?region=#{$region}","catalog"
 end

  def self.get_home_tabs
    HTTP.get "catalog_lists/catalog-tabs?region=#{$region}","catalog"
  end

	def self.subscription_plans
	  HTTP.get "catalog_lists/subscription-list?&region=#{$region}","catalog"
	  # HTTP.get "catalog_lists/subscription-list?&region=#{$region}","catalog"
	end

  def self.get_items_list(list_id)
  	HTTP.get "catalog_lists/#{list_id}?region=#{$region}&page=0&page_size=100","catalog"
  end

  def self.get_items_list_with_pagination(list_id,page_no,page_size)
    HTTP.get "catalog_lists/#{list_id}?region=#{$region}&page=#{page_no}&page_size=#{page_size}","catalog"
  end

  def self.get_catalog_details(catalog_slug)
    HTTP.get "catalogs/#{catalog_slug}/items?region=#{$region}","catalog"
  end

  def self.get_catalog_details_with_pagination(catalog_slug)
   HTTP.get "catalogs/#{catalog_slug}/items?region=#{$region}&page=0&page_size=100","catalog"

  end

  def self.get_items_details(catalog_slug,item_slug)
     HTTP.get "catalogs/#{catalog_slug}/items/#{item_slug}?region=#{$region}","catalog"
  end


  def self.get_items_genre(catalog_slug,genre)
     HTTP.get "catalogs/#{catalog_slug}/items?genre=#{genre}&region=#{$region}&page=0&page_size=100","catalog"
  end


  def self.get_all_epsiodes(catalog_slug,show_slug)
    HTTP.get "catalogs/#{catalog_slug}/items/#{show_slug}/episodes?region=#{$region}","catalog"
  end
 
  def self.get_all_epsiodes_with_pagination(catalog_slug,show_slug,page_no)
    HTTP.get "catalogs/#{catalog_slug}/items/#{show_slug}/episodes?page=#{page_no}&page_size=10&region=#{$region}","catalog"
  end

  
  def self.get_episode_details(catalog_slug,show_slug,episode_slug)
    HTTP.get "catalogs/shows/#{show_slug}/episodes/#{episode_slug}?region=#{$region}","catalog"
  end

  def self.get_all_catalogs
    HTTP.get "catalogs?region=#{$region}","catalog"
  end

  def self.get_search_results(search_name)
    HTTP.get "search?filters=category,all&q=#{search_name}&region=#{$region}","catalog"
  end

  def self.get_user_region(ip_addrs)
    HTTP.get "regions/ip/#{ip_addrs}","catalog"
  end

  def self.user_plans(user_session)
    HTTP.get "users/#{user_session}/user_plans?auth_token=Ts4XpMvGsB2SW7NZsWc3&region=#{$region}","catalog"
  end

  def self.get_all_channels
    HTTP.get "catalog_lists/all-channels?page_size=150&region=#{$region}","catalogs"
  end

  def self.get_channel_programs(catalog_id,channel_id)
    HTTP.get "catalogs/#{catalog_id}/items/#{channel_id}/programs?region=#{$region}&status=any","catalogs"
  end

end