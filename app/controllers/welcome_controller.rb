class WelcomeController < ApplicationController
    before_action :authenticate_user!
    def index
        @user=current_user
        @books=@user.books
        #@books.as_json(:only => [:id, :title, :description])
        @component='BookList'
        @books.as_json
    end
end