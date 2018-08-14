# == Schema Information
#
# Table name: images
#
#  id           :bigint(8)        not null, primary key
#  name         :string(255)
#

class Image < ApplicationRecord
  validates :name, presence: {message: 'Name can\'t be empty'}, allow_nil: true

  validates_associated :book
  
  belongs_to :book

  mount_base64_uploader :name, ImageUploader

end

