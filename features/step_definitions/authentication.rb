require 'selenium-webdriver'

Before do
  if !$browser
    #options = Selenium::WebDriver::Chrome::Options.new
    caps = Selenium::WebDriver::Remote::Capabilities.new
    #caps['platform'] = 'WIN7'
    #caps['platformName'] = 'WIN7'
    caps['browserName'] = 'firefox'

    #$browser = Selenium::WebDriver.for :firefox#, options: options
    $browser = Selenium::WebDriver.for(
      :remote,
      :url => 'http://192.168.8.100:4444/wd/hub',
      :desired_capabilities => caps
    );
    $browser.manage.window.move_to(0, 0)
    #$browser.manage.window.resize_to(500, 800)
    $browser.manage.window.maximize
    $browser.manage.timeouts.implicit_wait = 7
  end
end

#Login
Given /^I am on the login page$/ do
  $browser.get("http://192.168.8.101:3000");
end

Given /^I have a browser setup$/ do

end

#Login =========================================================================
When /^I enter "(.*)" into the "(.*)" field$/ do |value, element|
  #find_elements...[0]
  #$browser.page.find_element(radio button name)[0] = first radio button in the list
  case element
    when 'email'
      element=1
    when 'password'
      element=2
    when 'password_confirmation'
      element=3
  end

  emailField=$browser.find_element(:xpath, "//div[@id='center-devise']/form/div[#{element}]/input");
  emailField.click();
  emailField.clear();
  emailField.send_keys(value);
end

When /^I click on "submit"$/ do
  submitButton=$browser.find_element(:xpath, "//div[@id='center-devise']/form/div[4]/input");
  submitButton.click();
end

Then ('the {string} should be visible') do |error_message|
  wait = Selenium::WebDriver::Wait.new(timeout: 10)
  errorMessages=wait.until { $browser.find_elements(:xpath, "//div[contains(@class, 'notifications')]/div[1]"); }
  #assert(@driver.find_element(:tag_name => "body").text.include?("Name"),"Invalid Email or password.")
  #verify { assert(errorMessage.text.include?("Name"),"Invalid Email or password.")}
  #$browser.verify { assert(errorMessage.text,"Invalid Email or password.")}
  #//div[contains(@class, 'Caption') and text()='Model saved']
  #element.attribute('outerHTML')
  errorMessages=$browser.find_elements(:xpath, "//div[contains(@class, 'notifications')]/div/span[@data-notify='message']");
  present=false
  errorMessages.each do |message|
    if message.text==error_message
      present=true
    end
  end
  expect(present).to equal(true)
end


#Signup ========================================================================
Given /^I am on the signup page$/ do
  $browser.get("http://192.168.8.101:3000");
  signupLink = $browser.find_element(:xpath, "//a[contains(text(), 'Sign up')]");
  signupLink.click();
end

After do
  #sleep 3
  #$browser.quit
end
