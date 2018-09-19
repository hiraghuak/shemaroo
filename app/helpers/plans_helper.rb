module PlansHelper
	def get_gradient title
		case title
		when "Bollywood packs"
			return "gradient2"
     when "Kids pack"
      return "gradient5"
    when "Punjabi packs"
      return "gradient9"
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
end
