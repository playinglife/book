class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable, :lockable

  has_many  :books, dependent: :destroy

  has_many	:loans
  has_many  :loaned_books, class_name: "Book", :through => :loans
end
