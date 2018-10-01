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
	@region = "US"
	payment_gateway = "admin"
	platform = "android"
	plans = params["plans"].split(",")
    packs = []
    all_price = ""
    all_price_charged = ""
    currency = ""
    plans.each do |plan|
     content_id  = plan.split("|").last
     pack_id  = plan.split("|").first
     pd  =   HTTP.get "catalogs/5b3c917fc1df417b9a00002c/items/#{content_id}?auth_token=Ts4XpMvGsB2SW7NZsWc3&region=#{@region}" ,"catalog"
     sp = pd["data"]["plans"].map{|e| e if e["id"] == pack_id}.compact.last
     price = sp["price"]
     all_price += price 

     price_charged = sp["discounted_price"]
     all_price_charged += price_charged 
     currency = sp["currency"]
       sub_pack = {}
       sub_pack["plan_categories"] = pd["data"]["category"]
       sub_pack["category_type"] = pd["data"]["category_type"]
       sub_pack["category_pack_id"] = content_id
       sub_pack["subscription_catalog_id"] = pd["data"]["catalog_id"]
       sub_pack["plan_id"] = sp["id"]
       packs << sub_pack
    end  

	payment_info = {"net_amount": all_price, "price_charged": all_price_charged,"currency": currency, "packs": packs }
	
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

    response =  HTTP.post_https "users/b16e4bf2afd8d4ab472adbb48ef1a2d8/transactions", purchase_params
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
     if $region == "IN"
     	price_charged = sp["pg_price"]["cc_avenue"]
     else
     	price_charged =  sp["pg_price"]["adyen"]
     end
	
	payment_info = { "price_charged": price_charged,"currency": sp["currency"], 
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
	response =  HTTP.post_https "users/b16e4bf2afd8d4ab472adbb48ef1a2d8/transactions/cse_payment", plans_purchase_params
    #render json: {:message => "payment processed",:status_data => response["data"] } , status: :ok
    #redirect_to  action: 'payment_response',  resp_data: response["data"]
    redirect_to root_path
	end

	def payment_response
		 params.require(:resp_data).permit
		 if params["resp_data"]["message"] == "pack activated successfully"

		 else
		 end 
		 	
	end

    def payment_processing
        
    end

    def payment_success
        
    end

    def payment_failed
        
    end
end
