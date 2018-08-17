class Author < ApplicationRecord
  validates :firstname, presence: {message: 'Firstname must exist'}, allow_nil: false, allow_blank: false
  validates :lastname, presence: {message: 'Lastname must exist'}, allow_nil: false, allow_blank: true
  validates :birthday, presence: {message: 'Author birthday must be set'}, allow_nil: false, allow_blank: false

  has_many    :books, dependent:   :destroy

end

