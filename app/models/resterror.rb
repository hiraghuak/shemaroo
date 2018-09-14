class RESTError < StandardError
  attr_reader :status_code

  def initialize(status_code)
  	@status_code = status_code
  end
end
