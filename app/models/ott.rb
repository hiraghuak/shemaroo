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

  def self.get_items_details(catalog_slug,item_slug)
     HTTP.get "catalogs/#{catalog_slug}/items/#{item_slug}?region=#{$region}","catalog"
  end

end