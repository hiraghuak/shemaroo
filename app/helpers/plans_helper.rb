module PlansHelper
	def get_gradient title
		case title
    when "Bollywood classic packs"
      return "gradient2"
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

  def get_gradient_color title
    case title
    when "Bollywood classic packs"
      return "gradientbg2"
    when "Bollywood packs"
      return "gradientbg3"
     when "Kids pack"
      return "gradientbg5"
    when "Punjabi packs"
      return "gradientbg8"
    when "Gujarathi packs"
      return "gradientbg4"
    when "Bhakti packs"
      return "gradientbg6"
    when "Ibadaat packs"
      return "gradientbg7"
    when "Combo packs"
      return "gradientbg4"
    when "All access pack"
      return "gradientbg1"
    end
  end

  def get_signature_key(packs)
   secret_key = "7c32c524a67f405812ca"
    all_plan_id = "" 
    packs.each do |p| 
    plan_id = p["plan_id"].blank? ? p[:plan_id] : p["plan_id"]
    all_plan_id += plan_id 
    end 
    session_id = cookies[:user_id]
    region = @region
    sec_key = secret_key+session_id+region+all_plan_id 
    md5_sign = Gibberish::MD5(sec_key) 
    return md5_sign
  end
end
