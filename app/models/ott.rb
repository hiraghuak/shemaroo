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

end