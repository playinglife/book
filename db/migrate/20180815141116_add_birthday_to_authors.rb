class AddBirthdayToAuthors < ActiveRecord::Migration[5.2]
  def change
	add_column :authors, :birthday, :datetime
  end
end
