class BooksController < ApplicationController
  #skip_before_action :verify_authenticity_token
  #before_action :authenticate_user!

  def index
    @user=current_user
    @data=[];

    @user.books.left_joins(:author, :loans).group('books.id').each{ |book| 

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
        available: book.available,
        cover: cover,
        givenTaken: book.loans.where(returned: false).count>0 ? true : false
      });
    }
    render json: {success: @success, message: @message, data: @data}, status: :ok
  end

  def show

  end

  def create
    book=Book.new;
    book.title='';
    book.description='';
    book.user=current_user;

    if (@success)
      if book.save!(:validate => false)
        @data=book
      else
        @success=false
        self.addMessage('Could not save data')
      end
    end
    render json: {success: @success, message: @message, data: @data}, status: :ok
  end



    def update
      book=Book.find(params[:id])
      if book.user!=current_user
        @success=false
        self.addMessage("You don't own this book so you can't change it.")
      end

      if (@success)
        if (params[:files])
          newImages=[]
          params[:files].map{ |file|
            image=Image.new
            image.name=file
            image.book=book
            if image.valid?
              book.images.push(image);
              newImages.push(image)
            else
              self.checkErrors(image)
            end
          }
          @data['newImages']=newImages
          if newImages.count>0
            @success=true
          end
        else
        
          if (params[:title])
            existing=current_user.books.find_by_title(params[:title])
            if existing && existing.id!=params[:id].to_i
              @success=false
              self.addMessage("There is already a book with the same title.")
            else
              book.title=params[:title];
            end
          end
          if (params[:description])
            book.description=params[:description];
          end
          if (params[:author])
            names=params[:author].split(" ")
            if names.length>1
              lastname=names[names.length-1]
              names.pop
              firstname=names.join(" ")
            else
              firstname=names[0]
              lastname=''
            end
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
            dif=book.available-(book.quantity-params[:quantity].to_i)
            if dif>=0
              book.quantity=params[:quantity];
            else
              @success=false
              self.addMessage("You can't reduce the total amount to #{params[:quantity]} because there are #{dif.abs} books lended")
            end
          end
          if (params[:cover])
            cover=Image.find(params[:cover])
            if (cover.book.user==current_user)

              book.images.each { |item|
                if item.id==params[:cover].to_i
                  item.cover=true
                elsif item.cover
                  item.cover=false
                end
              }

            else
              @success=false
              self.addMessage("You don't own this book so you can't change it.")
            end
          end
        end
        if (@success)
          book.valid?
          self.checkErrors(book)
        end
        if @success
          saved=book.save     #saved=book.save!(:validate => false)
          if !saved
            @success=false
            self.addMessage('Could not save data')
          end
        end

      end

      render json: {success: @success, message: @message, data: @data}, status: :ok    
    end

    def destroy
      book=Book.find(params[:id])
      if book.user==current_user
          book.delete
      else
          @success=false
          self.addMessage("You don't own this boo so you can't delete it.")
      end
      render json: {success: @success, message: @message, data: @data}, status: :ok    
    end

    def destroyImage
      image=Image.find(params[:id])
      if image.book.user==current_user
        image.delete
      else
        @success=false
        self.addMessage("You don't own this book so you can't delete images for it.")
      end
      render json: {success: @success, message: @message, data: @data}, status: :ok    
    end

  def others  #Other users books

      @user=current_user
      @data=[];

      User.includes(:books, :books => [:author, :images]).where("id<>?",@user.id).all.each{ |user| 
        if !user.books.empty? then
          user.books.each{ |book| 
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
              available: book.available,
              cover: cover,
              givenTaken: book.loans.where(returned: false).count>0 ? true : false
            });
          }
        end
      }
    render json: {success: @success, message: @message, data: @data}, status: :ok
  end

  def borrow
    user=current_user
    loan=Loan.where(:book_id=> params[:id], :user=> user, :returned=> false).first;
    if (loan.present?)
      @success=false
      self.addMessage('You have already borrowed this book')
    end

    ActiveRecord::Base.transaction do
      bookToBorrow=Book.find(params[:id]);
      if bookToBorrow.available==0
        @success=false
        self.addMessage('There are no more copies of this book available')
      end

      if (@success==true)
        loan=Loan.new
        loan.user = user
        loan.book = bookToBorrow
        loan.lend_date = Time.now
        loan.return_date = Time.now+7.days

        loan.valid?
        self.checkErrors(loan)
        if (@success==true)
          loan.save

          if bookToBorrow.available>0
            bookToBorrow.available-=1
            bookToBorrow.save
          end
        end
      else
        ActiveRecord::Rollback
      end
    end

    render json: {success: @success, message: @message, data: @data}, status: :ok
  end

  def book_params
    params.require(:book).permit(:title, :description, :image, :quantity, :image_cache, :remove_image)
  end
end
