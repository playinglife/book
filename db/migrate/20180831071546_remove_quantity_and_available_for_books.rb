class RemoveQuantityAndAvailableForBooks < ActiveRecord::Migration[5.2]

  def up
	remove_column :books, :quantity, :integer
	remove_column :books, :available, :integer
  end
  
  def down
	add_column :books, :quantity, :integer, :default => 0
	add_column :books, :available, :integer, :default => 0
  end
  
end
