Feature: The user should be able to login, logout, register and recover password

  Background: Background description
    Given I have a browser setup

  Scenario Outline: Error message should be visible when user tries to login with wrong username or password
     Given I am on the login page
      When I enter "<email>" into the "email" field
       And I enter "<password>" into the "password" field
       And I click on "submit"
      Then the "Invalid Email or password." should be visible

  Examples:
  | email                 | password      |
  | daniel.toma@reea.net  | bad password  |
  | a@a.a                 | bad password  |


  Scenario: Error message should be visible when user tries to signup with wrong username, password or password confirmation
     Given I am on the signup page
      When I enter "daniel.toma" into the "email" field
       And I enter "new_password" into the "password" field
       And I enter "new_password_confirmation" into the "password_confirmation" field
       And I click on "submit"
      Then the "email is invalid" should be visible
       And the "password_confirmation doesn't match Password" should be visible
