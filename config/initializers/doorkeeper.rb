Doorkeeper.configure do
  orm :active_record

  grant_flows %w(password)
  use_refresh_token
  access_token_expires_in (Rails.env.production? ? 4.hours : 1.day)

  resource_owner_authenticator do |routes|
    current_user || warden.authenticate!(scope: :user)
  end

  resource_owner_from_credentials do |routes|
    raise "Check if api_version restrictions must be defined in #{__FILE__}" if params[:api_version] != 1
    raise Doorkeeper::Errors::DoorkeeperError, :invalid_client if server.client_via_uid.nil?

    user = User.find_for_database_authentication(email: params[:email])
    if user && user.valid_for_authentication? { user.valid_password?(params[:password]) }
      # Doorkeeper::AccessToken.where(resource_owner_id: user.id).delete_all
      user.update_tracked_fields!(request)
      user
    else
      raise Doorkeeper::Errors::DoorkeeperError, :bad_request
    end
  end
end

module Doorkeeper
  module Helpers
    module Controller

      private
      def handle_token_exception(exception)
        error = get_error_response_from_exception exception
        headers.merge! error.headers
        self.response_body = error.body.to_json
        self.status = :bad_request
      end
    end
  end
end