require 'rails_helper'

describe Book do
  let (:book) do
		@book=Book.first
	end

  it "is not valid without a title" do
    expect(@book).not_to be_valid
  end

  it "is valid object" do
    expect(@book).to be_valid
  end


end