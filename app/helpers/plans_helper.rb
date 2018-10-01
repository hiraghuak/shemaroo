module PlansHelper
	def get_gradient title
		case title
		when "Bollywood packs"
			return "gradient3"
     when "Kids pack"
      return "gradient5"
    when "Punjabi packs"
      return "gradient8"
    when "Gujarathi packs"
      return "gradient4"
    when "Bhakti packs"
      return "gradient6"
    when "Ibadaat packs"
      return "gradient7"
    when "Combo packs"
      return "gradient4"
    end
	end

  def get_signature_key(packs)
   secret_key = "7c32c524a67f405812ca"
    all_plan_id = "" 
    packs.each do |p| 
    plan_id = p["plan_id"] 
    all_plan_id += plan_id 
    end 
    p all_plan_id
    session_id = "b16e4bf2afd8d4ab472adbb48ef1a2d8" #params["user_id"] #-------- user session_id 
    region = @region
    sec_key = secret_key+session_id+region+all_plan_id 
    md5_sign = Gibberish::MD5(sec_key) 
    return md5_sign
  end
end
