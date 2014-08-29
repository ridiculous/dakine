module ActiveRecordExtensions
  def self.included(base)
    base.extend(ClassMethods)
  end
  
  def associations?
    associations.present?
  end

  def associations
    reflections.select { |key, _| send(key).present? rescue nil }.keys
  end

  module ClassMethods
    def except_for(*ids)
      scoped.where("#{quoted_table_name}.id NOT IN (?)", ids)
    end
    
    def since(time)
      scoped.where("#{quoted_table_name}.created_at > ?", time)
    end
    
    def before(time)
      scoped.where("#{quoted_table_name}.created_at < ?", time)
    end
    
    def between(start_at, end_at)
      since(start_at).before(end_at)
    end
    
    def latest
      scoped.order("#{quoted_table_name}.id ASC").last
    end
  end
end

ActiveRecord::Base.send(:include, ActiveRecordExtensions)
