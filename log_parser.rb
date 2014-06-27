# = Designed to parse unicorn production logs
#
# == Specifically the format of
#I, [2014-06-26T04:07:46.181524 #17318]  INFO -- : Started GET "/users/1/notifications" for 104.7.10.5 at 2014-06-26 04:07:46 +0000
#I, [2014-06-26T04:07:46.185629 #17318]  INFO -- : Processing by UserNotificationsController#index as HTML
#I, [2014-06-26T04:07:46.185699 #17318]  INFO -- :   Parameters: {"user_id"=>"1"}
#I, [2014-06-26T04:07:46.225015 #17318]  INFO -- :   Rendered user_notifications/index.html.erb within layouts/user (25.3ms)
#I, [2014-06-26T04:07:46.229240 #17318]  INFO -- : Completed 200 OK in 43ms (Views: 29.2ms | ActiveRecord: 2.4ms)
#
# == Identifies the user and forms a trail
# Matches by the USER_PATTERN and will group all other requests with same IP address
# Even keeps track of multiple IP addresses, since users may access site from several locations

class LogParser

  TIME_PATTERN = %r{(\d+-\d+-\d+T\d+:\d+:\d+)}
  USER_PATTERN = %r{/users/(\d+)/}
  LINE_PATTERN = %r{
                  (PUT|DELETE|GET|POST|PATCH) # method type
                  +\s"(.+)"\s                 # path
                  for\s([\d.]+)               # ip address
                  }x

  attr_reader :file, :lines, :users

  def initialize(file_name)
    @file = file_name
    @lines = []
    @users = {}
  end

  def scan
    File.open(file, 'r') do |f|
      while line = f.gets
        if line =~ LINE_PATTERN
          lines << LineItem.new($1, $2, $3, line)
        end
      end
    end
  end

  def group_by(key)
    lines.group_by { |line| line.send(key) }
  end

  def for_user(user_id)
    find_users if users.empty?
    ip = Array(users[user_id])
    lines.select { |line| ip.include?(line.ip) }
  end

  def find_users
    lines.each do |line|
      if line.path =~ USER_PATTERN
        users[$1] ||= Set.new
        users[$1] << line.ip
      end
    end
  end

  class LineItem < Struct.new(:action, :path, :ip, :line)

    def inspect
      "<#{action} #{path} #{ip}>"
    end

    def to_s
      "#{time} #{action} #{path}"
    end

    def time
      Time.parse(line[TIME_PATTERN, 1])
    rescue
      nil
    end

  end

end
