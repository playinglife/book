module Api::V1
  class BaseController < ApplicationController
    respond_to :json
    before_action :doorkeeper_authorize!




    def current
      render json: User.find(doorkeeper_token.resource_owner_id)
    end


  end
end