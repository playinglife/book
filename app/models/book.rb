class Book < ApplicationRecord
  validates :title, presence: {message: 'Please enter a title'}, allow_nil: false, allow_blank: false
  validates :title, length: { in: 2..100 , message:'Title must be between 2 and 100 characters long'}, allow_nil: false, allow_blank: false
  validates :title, format: { with: /\A[a-zA-Z0-9\s\-_]*\z/, message: 'Please enter only letters, space and the following characters: "-" , "_" ' }, allow_nil: false, allow_blank: false
  
  validates :description, presence: {message: 'Please enter a description'}, allow_nil: false, allow_blank: false
  validates :description, length: { in: 10..1000 , message:'Description  must be between 10 and 1000 characters long'}, allow_nil: false, allow_blank: false

  validates_numericality_of :quantity, on: :update, message: 'Quantity must be a number less than 100', less_than: 100

  validates_associated :user
  
  belongs_to  :user
  belongs_to  :author
  has_many    :images, dependent: :destroy, autosave: true

    
  has_many :loans
  has_many :users, :through => :loans
  
  end
