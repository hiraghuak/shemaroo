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
  if params["plans"].present? && params["plans"].split(",").count == 2
     plan_title = params["plans"].split(",").map{|a| a.split("|")[2] }.last
    items  =   Ott.get_catalog_details("5b3c917fc1df417b9a00002c")
      @combo_plan = items["data"]["items"].last
      @combo_pack = items["data"]["items"].last["plans"].map{|e| e if e["title"].downcase == plan_title.downcase}.compact.last
  render "combo_plans_summary"
 end
	end

	def payment_url
	if @region == "US"
	 payment_gateway = "adyen"
    else
     payment_gateway = "ccavenue"
    end
	platform = "android"  #TODO	
    if params["combo_pack_id"].blank?
    plans = params["plans"].split(",")
  else
    plans = []
   end
    if plans.count != 2 &&  !plans.empty?
    packs = []
     plan =  plans[0]
     content_id  = plan.split("|")[5]
     pack_id  = plan.split("|").first
     pd  =   HTTP.get "catalogs/5b3c917fc1df417b9a00002c/items/#{content_id}?auth_token=Ts4XpMvGsB2SW7NZsWc3&region=#{@region}" ,"catalog"
     sp = pd["data"]["plans"].map{|e| e if e["id"] == pack_id}.compact.last
    
     all_price = sp["price"] 
     currency = sp["currency"]
     price_charged = sp["discounted_price"]
     all_price_charged = params["disc_amount"] == "null" ? price_charged : params["disc_amount"]

       sub_pack = {}
       sub_pack["plan_categories"] = [pd["data"]["category"]]
       sub_pack["category_type"] = pd["data"]["category_type"]
       sub_pack["category_pack_id"] = content_id
       sub_pack["subscription_catalog_id"] = pd["data"]["catalog_id"]
       sub_pack["plan_id"] = sp["id"]
       packs << sub_pack    
    else
      pack_id =params["combo_pack_id"]
      items  =   Ott.get_catalog_details("5b3c917fc1df417b9a00002c")
      @combo_plan = items["data"]["items"].last
      @combo_pack = items["data"]["items"].last["plans"].map{|e| e if e["id"] == pack_id}.compact.last
      all_price = @combo_pack["price"]
      all_price_charged = params["disc_amount"] == "null" ? @combo_pack["discounted_price"] : params["disc_amount"]
      currency = @combo_pack["currency"]
      packs = []
      sub_pack = {}
       sub_pack["plan_categories"] = params["plans"].split(",").map{|a| a.split("|")[6] }
       sub_pack["category_type"] = @combo_plan["category_type"]
       sub_pack["category_pack_id"] = @combo_plan["category_id"]
       sub_pack["subscription_catalog_id"] = @combo_plan["catalog_id"]
       sub_pack["plan_id"] = @combo_pack["id"]
       packs << sub_pack
    end
   if  params["coupon_code"] == "null"
      payment_info = {"net_amount": all_price, "price_charged": all_price_charged,"currency": currency, "packs": packs }
   else
     coupon_code = params["coupon_code"]
     coupon_code_id = params["coupon_code_id"]
     payment_info = {"net_amount": all_price, "price_charged": all_price_charged,"currency": currency, "packs": packs, "coupon_code": coupon_code,"coupon_code_id": coupon_code_id  }
   end
  transaction_info = 	{"app_txn_id":"", "txn_message":"One Day Pack_10.00", "txn_status":"init", "order_id":"", "pg_transaction_id":""	}
	 user_info = {"email": cookies[:user_login_id], "mobile_number": cookies[:user_login_id]}

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
    # byebug
    # raise purchase_params.inspect
    response =  HTTP.post_https "users/#{cookies[:user_id]}/transactions", purchase_params
    if payment_gateway == "adyen"
      render json: {:message => "adyen payment iniated",:init_data => response["data"] } , status: :ok
    else
      # byebug
      # raise payment_info.inspect
      payment_url = "#{response['data']['payment_url']}&encRequest=#{response['data']['msg']}&access_code=#{response['data']['access_code']}"
      render json: {:message => "ccavenue payment iniated",:payment_url => payment_url} , status: :ok
    end 
	end	


	def purchase_plans
	payment_gateway = "admin"
	platform = "android"

  if params["combo_plan_id"].blank?
  plan_id = params["plans"].split(",").map{|a| a.split("|")[-2]}[0]
	pack_id = params["plans"].split(",").map{|a| a.split("|")[0]}[0]
  else
    plan_id = params["combo_plan_id"]
    pack_id = params["combo_pack_id"]
  end
     pd  =   HTTP.get "catalogs/5b3c917fc1df417b9a00002c/items/#{plan_id}?auth_token=Ts4XpMvGsB2SW7NZsWc3&region=#{@region}" ,"catalog"
     sp = pd["data"]["plans"].map{|e| e if e["id"] == pack_id}.compact.last
     if @region == "IN"
     	price_charged = sp["pg_price"]["cc_avenue"]
     else
     	price_charged =  sp["pg_price"]["adyen"]
     end

       if params["combo_plan_id"].blank?
        plan_categories = [ pd["data"]["category"]]
       else
        plan_categories = params["plans"].split(",").map{|a| a.split("|")[6] }
       end


	payment_info = { "price_charged": price_charged,"currency": sp["currency"], 
		     "packs":[
		     	{"plan_categories": plan_categories,
		     	"category_type": pd["data"]["category_type"],
		     	"subscription_catalog_id": pd["data"]["catalog_id"],
		     	"category_pack_id": plan_id,
		     	"plan_id": sp["id"]
		        }]}
    adyen_encrypted_data = params["adyen-encrypted-data"]
    user_info = {"email": cookies[:user_login_id], "mobile_number": cookies[:user_login_id]}
		plans_purchase_params = {
		"auth_token": "Ts4XpMvGsB2SW7NZsWc3", 
		"payment_info": payment_info,
		"transaction_info": {"order_id": params["order_id"], "adyen_encrypted_data": adyen_encrypted_data},
		"user_info": user_info
}
	response =  HTTP.post_https "users/#{cookies[:user_id]}/transactions/cse_payment", plans_purchase_params
     if !response["data"].blank? && response["data"]["message"] == "pack activated successfully"
     redirect_to  action: 'payment_success',  resp_data: response
     else
      redirect_to  action: 'payment_failed',  resp_data: response
    end
	end


    def payment_success
        params.require(:resp_data).permit
        @resp = params[:resp_data]
    end

    def payment_failed
       params.require(:resp_data).permit
       @resp = params[:resp_data]
    end

    def payment_canceled
      enc_resp = params["encResp"]
      order_id = params["orderNo"]
      payment_params = {"encResp": enc_resp, "orderNo": order_id, "region":"IN", "auth_token":"Ts4XpMvGsB2SW7NZsWc3", "payment_gateway":"ccavenue"}
      @resp =  HTTP.post_https "payment_complete/ccavenue/secure_payment", payment_params
    end


    def payment_response
      enc_resp = params["encResp"]
      order_id = params["orderNo"]
      payment_params = {"encResp": enc_resp, "orderNo": order_id, "region":"IN", "auth_token":"Ts4XpMvGsB2SW7NZsWc3", "payment_gateway":"ccavenue"}
      response =  HTTP.post_https "payment_complete/ccavenue/secure_payment", payment_params
      @resp = response["data"]
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

    def apply_promocode
       if params["combo_plan_id"].blank?
        plan_id = params["plans"].split(",").map{|a| a.split("|")[-2]}[0]
        pack_id = params["plans"].split(",").map{|a| a.split("|")[0]}[0]
        else
          plan_id = params["combo_plan_id"]
          pack_id = params["combo_pack_id"]
        end
     pd  =   HTTP.get "catalogs/5b3c917fc1df417b9a00002c/items/#{plan_id}?auth_token=Ts4XpMvGsB2SW7NZsWc3&region=#{@region}" ,"catalog"
     sp = pd["data"]["plans"].map{|e| e if e["id"] == pack_id}.compact.last    
     if params["combo_plan_id"].blank?
        plan_categories = [ pd["data"]["category"]]
       else
        plan_categories = params["plans"].split(",").map{|a| a.split("|")[6] }
       end

       packs = [
          {"plan_categories": plan_categories,
          "category_type": pd["data"]["category_type"],
          "subscription_catalog_id": pd["data"]["catalog_id"],
          "category_pack_id": plan_id,
          "plan_id": sp["id"]
            }]

          us = get_signature_key(packs)
          coupon_params = {
            "auth_token": "Ts4XpMvGsB2SW7NZsWc3",
            "us": us ,
            "category_pack_id": plan_id ,
            "plan_id": sp["id"],
            "coupon_code": params["promocode"],
            "region": @region
          }
       response = HTTP.post_https "users/#{cookies[:user_id]}/apply_coupon_code", coupon_params
      
      if @region == "IN"
      price_charged = sp["pg_price"]["cc_avenue"]
     else
      price_charged =  sp["pg_price"]["adyen"]
     end    
     cpn_id = response["data"]["payment"]["coupon_id"]
     cpn_name = response["data"]["payment"]["coupon_code"]
      cpn_price = price_charged.to_f - response["data"]["payment"]["net_amount"].to_f
      render json: {:cpn_price => cpn_price, :net_amount => response["data"]["payment"]["net_amount"],:cpn_name => cpn_name, :cpn_id => cpn_id } , status: :ok

    end
end
