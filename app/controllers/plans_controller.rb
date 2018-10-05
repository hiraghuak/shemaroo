class PlansController < ApplicationController
	include PlansHelper
	def all_plans
	response = Ott.subscription_plans
	@all_plans = response["data"]["catalog_list_items"]		
	end

	def plans_summary
  response = Ott.subscription_plans
  @all_plans = response["data"]["catalog_list_items"] 
  @all_access_packs = @all_plans.last["catalog_list_items"].last

   #  pd  =   HTTP.get "catalogs/5b3c917fc1df417b9a00002c/items/#{params['pack_ids']}?auth_token=Ts4XpMvGsB2SW7NZsWc3&region=#{@region}" ,"catalog"
  #  raise pd.inspect
  # sp = pd["data"]["plans"].map{|e| e if e["id"] == pack_id}.compact.last
	end

	def payment_url
	if @region == "US"
	 payment_gateway = "adyen"
    else
     payment_gateway = "ccavenue"
    end
	platform = "android"  #TODO	
    plans = params["plans"].split(",")
    packs = []
    # @pack_ids = []
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
       sub_pack["plan_categories"] = [pd["data"]["category"]]
       sub_pack["category_type"] = pd["data"]["category_type"]
       sub_pack["category_pack_id"] = content_id
       sub_pack["subscription_catalog_id"] = pd["data"]["catalog_id"]
       sub_pack["plan_id"] = sp["id"]
       packs << sub_pack
       # @pack_ids << content_id
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
    	"auth_token":"Ts4XpMvGsB2SW7NZsWc3", "us": us, "region": @region, "payment_gateway": payment_gateway,"platform": platform,
    	"payment_info": payment_info,
    	"transaction_info": transaction_info,
    	"user_info": user_info,
        "miscellaneous": miscellaneous
    }
    response =  HTTP.post_https "users/b16e4bf2afd8d4ab472adbb48ef1a2d8/transactions", purchase_params
    if payment_gateway == "adyen"
      render json: {:message => "adyen payment iniated",:init_data => response["data"] } , status: :ok
    else
      payment_url = "#{response['data']['payment_url']}&encRequest=#{response['data']['msg']}&access_code=#{response['data']['access_code']}"
      render json: {:message => "ccavenue payment iniated",:payment_url => payment_url} , status: :ok
    end 
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
     if @region == "IN"
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
     if !response["data"].blank? && response["data"]["message"] == "pack activated successfully"
     redirect_to  action: 'payment_success',  resp_data: response
     else
      redirect_to  action: 'payment_failed',  resp_data: response
    end
	end

	# def payment_response
	# 	 params.require(:resp_data).permit
	# 	 if params["resp_data"]["message"] == "pack activated successfully"
 #           render partial: "payment_success"
	# 	 end 
	# end

    # def payment_processing
        
    # end

    def payment_success
        raise params.inspect
        params.require(:resp_data).permit
        @resp = params[:resp_data]
        p "&&&&&&&&&&&&&&&&&&&&&&"
        p @resp
    end

    def payment_failed
       params.require(:resp_data).permit
       @resp = params[:resp_data]
        p "*********************"
        p @resp
    end

    def payment_canceled
      enc_resp = params["encResp"]
      order_id = params["orderNo"]
      payment_params = {"encResp": enc_resp, "orderNo": order_id, "region":"IN", "auth_token":"Ts4XpMvGsB2SW7NZsWc3", "payment_gateway":"ccavenue"}
      response =  HTTP.post_https "payment_complete/ccavenue/secure_payment", payment_params
      raise response.inspect
    end


    def mobile_payment_success
      render :layout => false
    end

    def mobile_payment_failed
      render :layout => false
   end

   def mobile_payment_processing
     render :layout => false
   end

   def mobile_plans_purchase
      render :layout => false
   end

   def mobile_plans_summary
    response = Ott.subscription_plans
  @all_plans = response["data"]["catalog_list_items"] 
  @all_access_packs = @all_plans.last["catalog_list_items"].last
      render :layout => false
   end


    def mobile_plans

     response = Ott.subscription_plans
    @all_plans = response["data"]["catalog_list_items"]
    render :layout => false
    end
end
