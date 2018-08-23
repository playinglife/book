class Loan < ApplicationRecord
  validates :lend_date, presence: {message: 'Please enter a lend date'}, allow_nil: false, allow_blank: false
  
  belongs_to :book
  belongs_to :user

end
