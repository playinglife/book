class BooksController < ApplicationController
  skip_before_action :verify_authenticity_token

  def index
  end

  def show
  end

  def create
    @success=true;
    @data={}
    @message='';

    @book=Book.new;
    @book.title=params[:title];
    @book.description=params[:description];
    @book.user=current_user;

    if (@book.valid?)
      @book.save();
    else
      @message='Invalid data';
      @success=false;
    end

    render json: {success: @success, message: @message, data: @data}, status: :ok
  end

  def update
  end

  def destroy
  end
end
