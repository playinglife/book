class AddCoverToImage < ActiveRecord::Migration[5.2]
  def change
	add_column :images, :cover, :boolean, :default => false
  end
end
