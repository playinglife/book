class Api::V1::BaseController < ApplicationController

  respond_to :json
  before_action :doorkeeper_authorize!

  private

    def current_user
      @current_user ||= User.find(doorkeeper_token[:resource_owner_id])
    end
    helper_method :current_user

end
