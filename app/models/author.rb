class Author < ApplicationRecord
  validates :firstname, presence: {message: 'Please enter the author\'s firstname'}, allow_nil: false, allow_blank: false
  validates :lastname, presence: {message: 'Please enter the author\'s lastname'}, allow_nil: false, allow_blank: true
  validates :birthday, presence: {message: 'Please select the author\'s birthday.'}, allow_nil: false, allow_blank: false
  validate :birthday_must_be_in_the_past

  has_many    :books, dependent:   :destroy


  def birthday_must_be_in_the_past
    if birthday.present? && birthday.future?
      errors.add(:birthday, "must be in the past")
    end
  end    
end

