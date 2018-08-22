class Author < ApplicationRecord
  validates :firstname, presence: {message: 'Please enter the author\'s firstname'}, allow_nil: false, allow_blank: false
  validates :lastname, presence: {message: 'Please enter the author\'s lastname'}, allow_nil: false, allow_blank: true
  validates :birthday, presence: {message: 'Please select the author\'s birthday.'}, allow_nil: false, allow_blank: false

  has_many    :books, dependent:   :destroy

end

