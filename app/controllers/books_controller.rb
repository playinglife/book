class BooksController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :authenticate_user!, except: [:index]
  def index
    @success=true;
    @data={}
    @message='';

    if user_signed_in?
      @success=true;
      @message='';

      @user=current_user
      @data=@user.books
    else
      @success=false
      @message='You are not logged in. Please log in first.'
    end
    render json: {success: @success, message: @message, data: @data}, status: :ok
  end

  def show

  end

  def create
    @success=true;
    @data={}
    @message='';

    if user_signed_in?
        @book=Book.new;
        @book.title=params[:title];
        @book.description=params[:description];
        @book.user=current_user;

        if @book.title.length==0
            @success=false
            @message='Please enter a title'
        end

        if (@success && @book.description.length==0)
            @success=false
            @message='Please enter a description'
        end

        if (@success && !@book.valid?)
            @success=false;
            @message='Invalid data';
        end

        if (@success && !@book.save())
            @success=false
            @message='Could not save data'
        end
      else
        @success=false
        @message='You are not logged in. Please log in first.'
      end
      render json: {success: @success, message: @message, data: @data}, status: :ok
  end

    def update
        @success=true;
        @data={}
        @message='';

        if user_signed_in?
            @success=true
            @message=''

            book=Book.find(params[:id])
            if book.user==current_user
                book.title=params[:title];
                book.description=params[:description];
                if (!book.save())
                    @success=false
                    @message='Could not save data'
                end
            else
                @success=false
                @message="You don't own this boo so you can't change it."
            end
        else
            @success=false
            @message='You are not logged in. Please log in first.'
        end
        render json: {success: @success, message: @message, data: @data}, status: :ok    
    end

    def destroy
        @success=true;
        @data={}
        @message='';

        if user_signed_in?
            @success=true;
            @message='';

            book=Book.find(params[:id])
            if book.user==current_user
                book.delete
            else
                @success=false
                @message="You don't own this boo so you can't delete it."
            end
        else
            @success=false
            @message='You are not logged in. Please log in first.'
        end
        render json: {success: @success, message: @message, data: @data}, status: :ok    
    end
end
