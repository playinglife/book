class BooksController < ApplicationController
  #skip_before_action :verify_authenticity_token
  #before_action :authenticate_user!

  def index
    @data={}

    #if user_signed_in?
      @success=true;
      @message='';

      @user=current_user
      @data=[];
      @user.books.includes(:author).each{ |book| 

        if !book.images.empty? then
          cover=book.images.find { |b| b.cover==true }
          if cover 
            cover=cover.id
          else
            cover=nil
          end
        else
          cover=nil
        end

        @data.push({
          id: book.id,
          title:book.title,
          description: book.description,
          author: book.author.blank? ? nil : "#{book.author.firstname} #{book.author.lastname}",
          images: book.images,
          quantity: book.quantity,
          cover: cover
        });
      }
    #else
    #  @success=false
    #  @message='redirect'
    #  @data=new_user_session_url
    #end
    render json: {success: @success, message: @message, data: @data}, status: :ok
  end

  def show

  end

  def create
    @data={}

    if user_signed_in?
        book=Book.new;
        book.title='';
        book.description='';
        book.user=current_user;

        if (@success)
          if book.save!(:validate => false)
            @data=book
          else
            @success=false
            @message='Could not save data'
          end
        end
      else
        @success=false
        @message='redirect'
        @data=new_user_session_url
      end
      render json: {success: @success, message: @message, data: @data}, status: :ok
  end



    def update
        @data={}

        if user_signed_in?
            book=Book.find(params[:id])
            if book.user!=current_user
              @success=false
              @message="You don't own this book so you can't change it."
            end

            if (@success)
              if (params[:title])
                existing=current_user.books.find_by_title(params[:title])
                if existing && existing.id!=params[:id].to_i
                  @success=false
                  @message="There is already a book with the same title."
                else
                  book.title=params[:title];
                end
              end
              if (params[:description])
                book.description=params[:description];
              end
              if (params[:author])
                names=params[:author].split(" ")
                lastname=names[names.length-1]
                names.pop
                firstname=names.join(" ")
                #joined=params[:author].gsub(/\s+/, "")

                author=Author.where("firstname=? AND lastname=?","#{firstname}","#{lastname}").first
                #author=Author.where("CONCAT(firstname,lastname) = ?" , "#{joined}").first
                if author.blank?
                  author=Author.new({
                    firstname: firstname,
                    lastname: lastname,
                    birthday: params[:birthday]
                  })
                  if author.valid?
                    author.save
                  else
                    self.checkErrors(author)
                  end
                end
                
                book.author=author
              end
              if (params[:quantity])
                book.quantity=params[:quantity];
              end
              if (params[:file])
                image=Image.new
                image.name=params[:file]
                book.images.push(image);
              end
              if (params[:cover])
                cover=Image.find(params[:cover])
                if (cover.book.user==current_user)

                  book.images.each { |item|
                    if item.cover
                      item.cover=false
                      item.save
                    end
                  }

                  cover.cover=true
                  cover.save
                else
                  @success=false
                  @success=false
                  @message="You don't own this book so you can't change it."
                end
              end
            end

            if (@success)
              if (!params[:file])   #Only check validation errors if book is saved and not just an image upload for the book
                book.valid?
                if (book.errors.messages.length>0)
                  @success=false;
                  @message=Array.new;

                  book.errors.messages.each do |key,attrMessage|
                    attrMessage.each do |errMessage|
                      @message.push errMessage
                    end
                  end

                  if @message.length==1
                    @message=@message[0]
                  end
                end
              end

              if @success
                if (params[:file])
                  saved=book.save!(:validate => false)
                else
                  saved=book.save()
                end

                if saved
                  if (params[:file]) 
                    @data['newImage']=image
                  end
                else
                  @success=false
                  @message='Could not save data'
                end
              end

            end
        else
          @success=false
          @message='redirect'
          @data=new_user_session_url
        end
        render json: {success: @success, message: @message, data: @data}, status: :ok    
    end

    def destroy
        @data={}

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
          @message='redirect'
          @data=new_user_session_url
        end
        render json: {success: @success, message: @message, data: @data}, status: :ok    
    end

    def destroyImage
        @data={}

        if user_signed_in?
            @success=true;
            @message='';

            image=Image.find(params[:id])

            if image.book.user==current_user
              image.delete
            else
              @success=false
              @message="You don't own this book so you can't delete images for it."
            end
        else
          @success=false
          @message='redirect'
          @data=new_user_session_url
        end
        render json: {success: @success, message: @message, data: @data}, status: :ok    
    end

    def book_params
      params.require(:book).permit(:title, :description, :image, :quantity, :image_cache, :remove_image)
    end
end
