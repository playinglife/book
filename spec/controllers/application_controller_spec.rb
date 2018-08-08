require 'rails_helper'

describe ApplicationController do


  describe "GET #index" do

    xit "responds with json" do
      get :index
      expect(response).to render_template :index
    end

    xit "responds with json" do
    end

  end
  
end
