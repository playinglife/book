namespace :my_tasks do
  desc "Check and notify through email loaned books which need to be returned"
  task :cron => :environment do

	loans=Loan.includes(:user, :book, :book => [:user]).where("returned=false AND ?>return_date",1.day.from_now.to_date)
    if loans.empty?
      puts 'There are no books which need to be returned'
    else
      puts 'List of all books that need to be returned'
    end

    loans.each do |loan|
      puts "'#{loan.book.user.email}' needs to return book with title '#{loan.book.title}' to '#{loan.user.email}'."
      TheMailer.with(lender: loan.book.user, borrower: loan.user, limit_date: loan.lend_date.to_s, book_title: loan.book.title).get_back_book_email.deliver_later
      TheMailer.with(lender: loan.book.user, borrower: loan.user, limit_date: loan.lend_date.to_s, book_title: loan.book.title).return_book_email.deliver_later
    end

    if !loans.empty?
      puts 'End of list'
      puts
    end

  end
  
end
