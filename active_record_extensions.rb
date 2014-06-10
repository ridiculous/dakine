module ActiveRecordExtensions
  def self.included(base)
    base.extend(ClassMethods)
  end

  module ClassMethods
    def except_for(*ids)
      where("#{quoted_table_name}.id NOT IN (?)", ids)
    end
  end
end

ActiveRecord::Base.send(:include, ActiveRecordExtensions)
