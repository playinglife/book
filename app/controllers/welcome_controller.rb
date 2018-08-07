class WelcomeController < ApplicationController
    #before_action :authenticate_user!
    def index
        #@user=current_user
        ##@books=@user.books
        #@books.as_json(:only => [:id, :title, :description])
        @component='BookList'
        @data=[];
        #@books.each{ |book| 
        #  @data.push({
        #    id: book.id,
        #    title:book.title,
        #    description: book.description,
        #    image: book.image.url
        #  });
        #}
        @loggedIn=user_signed_in?
        @reset_password_token=params[:reset_password_token]?params[:reset_password_token]:nil
        @unlock_token=params[:unlock_token]?params[:unlock_token]:nil
    end
end