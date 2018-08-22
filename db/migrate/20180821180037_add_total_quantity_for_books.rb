class AddTotalQuantityForBooks < ActiveRecord::Migration[5.2]
  def up
	add_column :books, :available, :integer, default: 0, null: false 
  end
  
  def down
	remove_column :books, :available
  end
end
