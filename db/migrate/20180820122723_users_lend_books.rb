class UsersLendBooks < ActiveRecord::Migration[5.2]
  def self.up
    create_table :loans do |t|
      t.belongs_to 	:user, index: true
      t.belongs_to 	:book, index: true
      t.datetime 	:lend_date
	  t.integer		:days
	  t.datetime 	:return_date
      t.timestamps
    end
  end
  
  def self.down
	drop_table :loans
  end
end