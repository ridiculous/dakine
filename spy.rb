module Spy
  def self.extended(base)
    (base.methods - [:object_id, :__send__]).each do |method_name|
      module_eval <<-RUBY
        def #{method_name}(*args)
          puts "Called #{method_name}"
          super
        end
      RUBY
    end
  end
end
