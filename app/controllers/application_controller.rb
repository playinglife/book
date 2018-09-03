class ApplicationController < ActionController::Base

  respond_to :json, :html
  
  def initialize
    super
    @success=true;
    @message=[];
    @data={};
  end

  def addMessage(msg, toTheEnd=true)
    if msg.class.to_s=='String'
      if toTheEnd
        @message.push(msg)
      else
        @message.unshift(msg)
      end
    end
    if msg.class.to_s=='Array'
      if toTheEnd
        @message+=msg
      else
        @message=msg+@message
      end
    end
  end

  def hasErrors(model) 
    if (model.errors.messages.length>0)
      @success=false;
      return true
    else
      return false
    end
  end

  def checkErrors(model)
    if (model.errors.messages.length>0)
      @success=false;

      model.errors.messages.each do |key,attrMessage|
        attrMessage.each do |errMessage|
          @message.push(errMessage)
        end
      end
    end
  end

  rescue_from ActionController::InvalidAuthenticityToken do
    @success=false
    @message='redirect'
    @data=''
    render json: {success: @success, message: @message, data: @data}, status: :ok
  end

end
