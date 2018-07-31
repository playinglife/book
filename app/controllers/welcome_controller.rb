class WelcomeController < ApplicationController
    before_action :authenticate_user!
    def index
        @user=current_user
        @books=@user.books
        #@books.as_json(:only => [:id, :title, :description])
        @component='BookList'
        @data=[];
        @books.each{ |book| 
          @data.push({
            id: book.id,
            title:book.title,
            description: book.description,
            image: book.image.url
          });
        }
    end
end