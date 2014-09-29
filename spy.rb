module Spy
  def self.extended(base)
    (base.methods - Object.methods).each do |method_name|
      module_eval <<-RUBY
      def #{method_name}(*args)
        puts "Called #{method_name}"
        super
      end
      RUBY
    end
  end
end
