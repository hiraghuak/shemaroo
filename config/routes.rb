Rails.application.routes.draw do
 root "catalogs#index"
 get "/:catalog_name" => "catalogs#show_catalog_item"
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
