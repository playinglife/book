class PasswordsController < Devise::PasswordsController
  
  protected
  
  def after_sending_reset_password_instructions_path_for(resource_name)
    return new_user_session_url
  end
  
  def after_resetting_password_path_for(resource)
    return new_user_session_url
  end
end
