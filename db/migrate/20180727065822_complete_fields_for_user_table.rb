class CompleteFieldsForUserTable < ActiveRecord::Migration[5.2]
  def change
	add_column :users, :confirmation_token, :string
	add_column :users, :confirmed_at, :datetime
	add_column :users, :confirmation_sent_at, :datetime
	add_column :users, :unconfirmed_email, :integer, default: 0, null:false
	add_column :users, :unlock_token, :string
	add_column :users, :locked_at, :datetime
	add_index :users, :confirmation_token, unique: true
	add_index :users, :unlock_token, unique: true
	add_column :users, :name, :string
  end
end