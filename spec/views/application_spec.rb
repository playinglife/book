require 'rails_helper'

describe 'application.html.erb' do

    it "displays the left hand menu" do
      assign(:books)
      expect(response).to render_template :index
      expect(response).to render_template :welcome
    end
  
end
