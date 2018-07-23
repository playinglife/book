class AddUserAssociationToBooks < ActiveRecord::Migration[5.2]
   def self.up
      add_column :user, :book_id, :integer
      add_index 'user', ['book_id'], :name => 'index_book_id' 
   end

   def self.down
      remove_column :users, :book_id
   end
end
