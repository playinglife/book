class ApplicationMailer < ActionMailer::Base
  default from: 'admin@books.com'
  layout 'mailer'
end
