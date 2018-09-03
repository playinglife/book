require 'rails_helper'

describe User do

  it "is not valid when new" do
    @user=User.new
    expect(@user).not_to be_valid
  end

  it "is not valid without password" do
    @user=build(:user)
    allow(@user).to receive(:password).and_return(nil)
    expect(@user).not_to be_valid
  end

  it "is valid with password" do
    @user=build(:user)
    expect(@user).to be_valid
  end


end