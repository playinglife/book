class ApplicationController < ActionController::Base
  respond_to :json
  
  def initialize
    super
    @success=true;
    @message=[];
  end

  def checkErrors(model)
    if (model.errors.messages.length>0)
      @success=false;

      model.errors.messages.each do |key,attrMessage|
        attrMessage.each do |errMessage|
          @message.push errMessage
        end
      end
    end
  end

end
