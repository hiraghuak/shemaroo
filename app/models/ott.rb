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

  def self.get_items_list(list_id)
  	HTTP.get "catalog_lists/#{list_id}?region=#{$region}","catalog"
  end

  def self.get_catalog_details(catalog_slug)
    HTTP.get "catalogs/#{catalog_slug}?region=#{$region}","catalog"
  end

  def self.get_items_details(catalog_slug,item_slug)
     HTTP.get "catalogs/#{catalog_slug}/items/#{item_slug}?region=#{$region}","catalog"
  end


  def self.get_items_genre(catalog_slug,item_slug,genre)
     HTTP.get "catalogs/#{catalog_slug}/items?genre=#{genre}&region=#{$region}","catalog"
  end


  def self.get_all_epsiodes(catalog_slug,show_slug)
    HTTP.get "catalogs/#{catalog_slug}/items/#{show_slug}/episodes?region=#{$region}","catalog"
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

end