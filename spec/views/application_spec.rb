require 'rails_helper'

describe 'layouts/welcome.html.erb' do

    it "displays the render for Application React Component" do
      render 
      expect(rendered).to have_selector("div[data-react-class='Application']")
    end
  
end
