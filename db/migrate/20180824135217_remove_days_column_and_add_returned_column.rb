class RemoveDaysColumnAndAddReturnedColumn < ActiveRecord::Migration[5.2]
  def up
	remove_column :loans, :days, :integer
	add_column :loans, :returned, :bool, null: false, default: false
  end
  
  def down
	add_column :loans, :days, :integer
	remove_column :loans, :returned, :bool
  end
  
end
