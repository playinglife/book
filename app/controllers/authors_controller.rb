class AuthorsController < ApplicationController
  before_action :authenticate_user!


  def typeahead
    @data={}

    names=params[:query].split(" ")
    joined=names.join(' ')
    lastname=names[names.length-1]
    names.pop
    firstname=names.join(" ")

    #abort firstname+'===='+lastname
    authors  = Author.where("firstname LIKE ? OR lastname LIKE ? OR (firstname LIKE ? AND lastname LIKE ?)", "%#{joined}%", "%#{joined}%", "%#{firstname}%","%#{lastname}%")

    @data=[]
    authors.each{ |author| 
      @data.push({
        id: author.id,
        name: author.firstname+' '+author.lastname,
        firstname: author.firstname,
        lastname: author.lastname
      });
    }

    render json: {"data"=>@data, "success"=>true}
  end

end

