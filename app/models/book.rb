class Book < ApplicationRecord
  validates :title, presence: {message: 'Please enter a title'}, allow_nil: false, allow_blank: false
  validates :title, length: { in: 2..100 , message:'Title must be between 2 and 100 characters long'}, allow_nil: false, allow_blank: false
  validates :title, format: { with: /\A[a-zA-Z0-9\s\-_]*\z/, message: 'Please enter only letters, space and the following characters: "-" , "_" ' }, allow_nil: false, allow_blank: false
  validates :title, uniqueness: {message: 'There is already a book with this name'}, allow_nil: false, allow_blank: false

  validates :description, presence: {message: 'Please enter a description'}, allow_nil: false, allow_blank: false
  validates :description, length: { in: 10..1000 , message:'Description  must be between 10 and 1000 characters long'}, allow_nil: false, allow_blank: false

  validates_associated :user
  
  belongs_to :user

  mount_base64_uploader :image, ImageUploader

end
