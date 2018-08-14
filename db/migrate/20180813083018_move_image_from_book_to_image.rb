class MoveImageFromBookToImage < ActiveRecord::Migration[5.2]
  def change
	remove_column :books, :image, :string
  end
end
