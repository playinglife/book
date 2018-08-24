class TheMailer < ApplicationMailer
	default from: 'admin@book.com'

  def get_back_book_email
    @lender = params[:lender]
    @borrower = params[:borrower]
    @book_title = params[:book_title]
    @limit_date = params[:limit_date]
    mail(to: @lender.email, subject: 'You need to GET a book back')
  end

  def return_book_email
    @lender = params[:lender]
    @borrower = params[:borrower]
    @book_title = params[:book_title]
    @limit_date = params[:limit_date]
    mail(to: @borrower.email, subject: 'You need to GIVE a book back')
  end

end
