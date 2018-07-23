class AddBooksAssociationToUser < ActiveRecord::Migration[5.2]
	 def self.up
		  add_column :books, :user_id, :integer
		  add_index 'books', ['user_id'], :name => 'index_user_id' 
	  end

	  def self.down
		  remove_column :books, :user_id
	  end  
end
