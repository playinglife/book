class WelcomeController < ApplicationController
    #before_action :authenticate_user!
    def index
        ##@books=@user.books
        #@books.as_json(:only => [:id, :title, :description])
        @component='BookList'
        @data=[];
        #data is empty and is being populated through a GET request after ui is loaded
        #@books.each{ |book| 
        #  @data.push({
        #    id: book.id,
        #    title:book.title,
        #    description: book.description,
        #    image: book.image.url
        #  });
        #}
        if user_signed_in?
          @user=current_user
          @loggedIn=true
        else
          @user=nil
          @loggedIn=false
        end
        @reset_password_token=params[:reset_password_token]?params[:reset_password_token]:nil
        @unlock_token=params[:unlock_token]?params[:unlock_token]:nil
    end
end