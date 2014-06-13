module ActiveRecordExtensions
  def self.included(base)
    base.extend(ClassMethods)
  end

  module ClassMethods
    def except_for(*ids)
      scoped.where("#{quoted_table_name}.id NOT IN (?)", ids)
    end
    
    def since(time)
      scoped.where("#{quoted_table_name}.created_at > ?", time)
    end
  end
end

ActiveRecord::Base.send(:include, ActiveRecordExtensions)
