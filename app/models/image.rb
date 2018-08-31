class Image < ApplicationRecord
  #validates :name, presence: {message: 'File name can\'t be empty'}, allow_nil: true

  #validates_associated :book
  after_destroy :remove_folder
  
  belongs_to :book

  mount_base64_uploader :name, ImageUploader

  
  def remove_folder
    FileUtils.remove_dir("#{Rails.root}/public/uploads/#{self.id}/", :force => true)
  end

end

