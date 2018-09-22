class PlansController < ApplicationController
	def all_plans
	response = Ott.subscription_plans
	@all_plans = response["data"]["catalog_list_items"]		
	end

	def plans_summary
		@plans_summary = "plans_summary I don't know"
	end
end
