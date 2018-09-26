class PlansController < ApplicationController
	include PlansHelper
	def all_plans
	response = Ott.subscription_plans
	@all_plans = response["data"]["catalog_list_items"]		
	end

	def plans_summary
		@plans_summary = "plans_summary"
	end

	def payment_url

	@region = $region
	payment_gateway = "admin"
	platform = "android"
	plan_id = params["plans"].split(",").map{|a| a.split("|")[-1]}
	pack_id = params["plans"].split(",").map{|a| a.split("|")[0]}
    #packs = []
    # plans.each do 


    # end    
     pd  =   HTTP.get "catalogs/5b3c917fc1df417b9a00002c/items/#{plan_id[0]}?auth_token=Ts4XpMvGsB2SW7NZsWc3&region=#{@region}" ,"catalog"
     sp = pd["data"]["plans"].map{|e| e if e["id"] == pack_id[0]}.compact.last
	
	payment_info = {"net_amount": sp["price"], "price_charged": sp["discounted_price"],"currency": sp["currency"], 
		     "packs":[
		     	{"plan_categories":[ pd["data"]["category"]],
		     	"category_type": pd["data"]["category_type"],
		     	"subscription_catalog_id": pd["data"]["catalog_id"],
		     	"category_pack_id": plan_id[0],
		     	"plan_id": sp["id"]
		        }]}
	
	transaction_info = 	{"app_txn_id":"", "txn_message":"One Day Pack_10.00", "txn_status":"init", "order_id":"", "pg_transaction_id":""	}
	
	 user_info = {"email":"ankita@saranyu.in", "mobile_number":""}

    browser = Browser.new(:ua => request.env["HTTP_USER_AGENT"], :accept_language => "en-us")
    device_os = "NA" #,browser.ios? ? 'iOS' : (browser.android? ? 'android' : browser.platform.to_s)
    browser_name = browser.name.split(" ").join("_")
    browser_version=  "NA" #browser.full_version
    device_type = "NA" #browser.mobile? ? 'mobile' : browser.tablet? ? 'tablet' : 'desktop'
    subscription_status =  cookies["is_subscribed"] == "yes" ? "subscribed" : "unsubscribed"
    platform  = cookies["browser_type"] == "mobile" ? "WAP" : "WEB"
    device_brand = 'NA'
    device_model = 'NA'
    device_imei = 'NA'
    operator = cookies['operator'] != "undefined"  ? cookies['operator'] : 'NA'
    internet_network = 'NA'
    isp_name = 'NA'

    miscellaneous ={"browser": browser_name, "device_brand": device_brand,"device_IMEI": device_imei, "device_model": device_model, "device_OS": device_os ,"device_type": device_type ,"inet": internet_network,"isp": isp_name,"operator": operator}

	us = get_signature_key(payment_info[:packs])

    purchase_params = {
    	"auth_token":"Ts4XpMvGsB2SW7NZsWc3", "us": us, "region": @region, "payment_gateway": "adyen","platform": "web",
    	"payment_info": payment_info,
    	"transaction_info": transaction_info,
    	"user_info": user_info,
    }
    response =  HTTP.post "users/b16e4bf2afd8d4ab472adbb48ef1a2d8/transactions", purchase_params, "catalog"
    render json: {:message => "payment iniated",:init_data => response["data"] } , status: :ok
	end	


	def purchase_plans
	payment_gateway = "admin"
	platform = "android"
	plan_id = params["plans"].split(",").map{|a| a.split("|")[-1]}
	pack_id = params["plans"].split(",").map{|a| a.split("|")[0]}
    # plans.each do 

    # end    
     pd  =   HTTP.get "catalogs/5b3c917fc1df417b9a00002c/items/#{plan_id[0]}?auth_token=Ts4XpMvGsB2SW7NZsWc3&region=#{@region}" ,"catalog"
     sp = pd["data"]["plans"].map{|e| e if e["id"] == pack_id[0]}.compact.last
	
	payment_info = { "price_charged": params["price_charged"],"currency": sp["currency"], 
		     "packs":[
		     	{"plan_categories":[ pd["data"]["category"]],
		     	"category_type": pd["data"]["category_type"],
		     	"subscription_catalog_id": pd["data"]["catalog_id"],
		     	"category_pack_id": plan_id[0],
		     	"plan_id": sp["id"]
		        }]}

    adyen_encrypted_data = params["adyen-encrypted-data"]
    user_info = {"email":"ankita@saranyu.in", "mobile_number":""}
		plans_purchase_params = {
		"auth_token": "Ts4XpMvGsB2SW7NZsWc3", 
		"payment_info": payment_info,
		"transaction_info": {"order_id": params["order_id"], "adyen_encrypted_data": adyen_encrypted_data},
		"user_info": user_info
}
	response =  HTTP.post "users/b16e4bf2afd8d4ab472adbb48ef1a2d8/transactions/cse_payment", plans_purchase_params
    render json: {:message => "payment iniated",:init_data => response["data"] } , status: :ok
	end
end
