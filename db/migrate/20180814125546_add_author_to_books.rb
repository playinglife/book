class AddAuthorToBooks < ActiveRecord::Migration[5.2]
  def self.up
	  add_column :books, :author_id, :integer
	  add_index 'books', ['author_id'], :name => 'index_author_id' 
  end
  
  def self.down
	  remove_column :books, :author_id
  end  
end
