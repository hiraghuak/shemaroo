class ApplicationController < ActionController::Base
  protect_from_forgery with: :null_session

# protect_from_forgery unless: -> { request.format.json? }
before_action :get_region,:check_browser
before_action :get_home_tabs,unless: -> { request.xhr? }
#[:sign_up,:sign_in,:validate_otp,:resend_otp]

include ApplicationHelper

def get_home_tabs
  resp = Ott.get_home_tabs
  @header_tabs = resp["data"]["catalog_list_items"] 
end


#get the user region based on ip address
  def get_region
    begin
        if Rails.env == "development"
<<<<<<< HEAD
          @region = "US"
=======
          @region = "IN"
          #@region = "US"
>>>>>>> master
          $region = @region
        else
          ip = get_user_ip
          response = Ott.get_user_region(ip)
          @region = response["region"]["country_code2"]
          $region = @region
        end
    rescue
      @region = "IN"
      $region = @region
    end
  end


  def get_user_ip
    if request.headers["HTTP_VIA"]
      if request.headers["HTTP_VIA"].include?"1.1 Chrome-Compression-Proxy"
        status,ip = get_x_forwarded_for_ip
        unless status
          ip = get_ip_from_http_true_client
        end
      else
        ip = get_ip_from_http_true_client
      end
    elsif request.headers["HTTP_X_CONTENT_OPT"]
      if request.headers["HTTP_X_CONTENT_OPT"].downcase.include?"turbo"
        status,ip = get_x_forwarded_for_ip
        unless status
          ip = get_ip_from_http_true_client
        end
      else
        ip = get_ip_from_http_true_client
      end
    else
      ip = get_ip_from_http_true_client
    end    
  end

  def get_x_forwarded_for_ip
    ip_addresses = request.headers["X-FORWARDED-FOR"]
    if ip_addresses
      ip_array = ip_addresses.split(",")
      ip = ip_array.first
      return [true, ip]
    else
      return [false, ""]
    end
  end

  def get_ip_from_http_true_client
    if request.headers["HTTP_TRUE_CLIENT_IP"]
      ip = request.headers["HTTP_TRUE_CLIENT_IP"]
    else
      ip = request.remote_ip
    end
    return ip
  end


    def check_browser
    ipad_device = request.user_agent.scan('iPad')
    if ipad_device.blank?
      @browser_type = detect_navigator
      if @browser_type.nil?
        @browser_type = 'desktop'
        cookies.delete "browser_type" if cookies["browser_type"]
      else
        cookies["browser_type"] = {
            value: @browser_type
        }
      end
    end
  end

  def detect_navigator
    return "mobile" if /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.match(request.user_agent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.match(request.user_agent[0..3])
  end


  def sign_smarturl smarturl,val=nil
    smart_url_key = PLAY_URL_TOKEN
    url = "#{smarturl}" + "?service_id=1&protocol=hls&play_url=yes"
    base_url = "#{url}&play_url=yes&us="
    signature = Digest::MD5.hexdigest("#{smart_url_key}#{base_url}")
    signed_url =  "#{base_url}#{signature}"
    header = {"Accept" => "application/json", "Cache-Control" => "no-cache"}
    resp = Typhoeus.get(signed_url,headers:header)
    obj = JSON.parse(resp.body)
    return obj
  end

end
