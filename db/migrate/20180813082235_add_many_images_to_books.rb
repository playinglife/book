class AddManyImagesToBooks < ActiveRecord::Migration[5.2]
  def change
	add_reference :images, :book, index: true
  end
end
