require 'rails_helper'

describe WelcomeController do


  describe "GET #index" do

    it "renders the :index view with :welcome layout" do
      get :index
      expect(response).to render_template :index
      expect(response).to render_template :welcome
    end

    it "returns status ok" do
      get :index
      expect(response).to have_http_status(200)
    end

    it "has unlock_token set to nil" do
      get :index
      expect(assigns(:unlock_token)).to eq(nil)
    end

    it "has reset_password_token set to nil" do
      get :index
      expect(assigns(:reset_password_token)).to eq(nil)
    end

    it "has unlock_token set to correct value" do
      get :index, :params => { :unlock_token => '1234567' }
      expect(assigns(:unlock_token)).to eq('1234567')
    end

    it "has reset_password_token set to correct value" do
      get :index, :params => { :reset_password_token => '1234567' }
      expect(assigns(:reset_password_token)).to eq('1234567')
    end

  end
  
end