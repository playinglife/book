require 'rails_helper'

describe Book do

  let (:book) do
		build(:book)
	end

  it "is not valid without a title" do
    expect(book).not_to be_valid
  end

  it "is valid with title" do
    @book=build(:book_ok)
    expect(@book).to be_valid
  end


end