class WelcomeController < ApplicationController
    before_action :authenticate_user!
    def index
      if user_signed_in?
        @user=current_user
        @books=@user.books
        #@books.as_json(:only => [:id, :title, :description])
        @books.as_json    
      else
        redirect_to login_path
      end

    end
end