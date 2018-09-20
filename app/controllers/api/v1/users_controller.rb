class Api::V1::UsersController < Api::V1::BaseController

  def current
    render json: { user: current_user, token: doorkeeper_token[:resource_owner_id] }
  end

end
