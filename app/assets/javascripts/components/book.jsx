APIUrls['Book']=window.location.href+'books';

class NewBook extends React.Component{
    constructor(props){
        super(props);
        this.rootRef = React.createRef();
        this.fileInput = React.createRef();
        this.saveButton = React.createRef();
        
        if (typeof this.props.data.id!='undefined'){
            this.newBook=false;
            this.state={previewing: true, reset: true};
            this.existingImage=this.props.data.image;
        }else{
            this.newBook=true;
            this.state={previewing: false, reset: false};
            this.existingImage=null;
        }
    }

    /*shouldComponentUpdate(nextProps){
        if (this.props.data.id!=nextProps.data.id || this.props.data.title!=nextProps.data.title || this.props.data.description!=nextProps.data.description ){
            return true
        }else{
            return false;
        }
    }*/

    componentWillReceiveProps(someProps) {
        if (typeof someProps.data.id!='undefined'){
            this.newBook=false;
        }else{
            this.newBook=true;
        }
        $(this.rootRef.current).find('#title').val(typeof someProps.data.title!='undefined' ? someProps.data.title : '');
        $(this.rootRef.current).find('#description').val(typeof someProps.data.description!='undefined' ? someProps.data.description : '');
    }    

    componentDidMount(){
    }

    handleFile(fileObj){
      var reader = new FileReader();

      this.fileName = fileObj.name;
      this.fileType = fileObj.type;

      reader.onload = function(e) {
        this.file = reader.result;
        this.setState({
          previewing: true
        });
      }.bind(this);
      reader.readAsDataURL(fileObj.file);

      this.setState({
        reset: true
      });
    }

    resetFile(){
      this.existingImage=null;
      this.setState({
        previewing: false,
        reset: true
      });

      setTimeout(function(){
        this.setState({
          reset: false
        });
      }.bind(this), 100);
    }

    saveBook(){
        $(this.saveButton.current).prop('disabled', true);
        if (!this.newBook){
            var url=APIUrls['Book']+'/'+this.props.data.id;
            var method='PUT';
        }else{
            var url=APIUrls['Book'];
            var method='POST';
        }
        
        var root=$(this.rootRef.current);
        
        let data = new FormData()
        data.append('title', root.find('#title').val());
        data.append('description', root.find('#description').val());
        if (this.existingImage!=null){
          data.append('file', '.'); //"." means don't update image because it's the same as the current one in the db
        }else{
          if (this.state.previewing==false){
            data.append('file', null);
          }else{
            data.append('file', this.file);
          }
        }
        global.loader.showLoader();
        
        fetch(url, {
          cache: 'reload',
          method: method,
          credentials: 'same-origin',
          body: data,
        }).then(response => response.json())
          .then(response =>{
            global.loader.hideLoader(); 
            if (response.success==true){
                global.app.notify('success','','Book succesfully updated');
                if (this.newBook){
                    root.find('#title').val('');
                    root.find('#description').val('');
                    this.resetFile();
                }else{
                    this.props.data.title=data.title;
                    this.props.data.description=data.description;
                }
            }else{
              if (response.message=='redirect'){
                window.location.replace(response.data);
              }else{
                if (response.message.constructor===Array){
                  var mess='';
                  $(response.message).each(function(ind,msg){
                    if (mess!=''){ mess+='<br>'; }
                    mess+=msg;
                  });
                  global.app.notify('danger','',mess);
                }else{
                  global.app.notify('danger','',response.message);
                }
              }
            }
            $(this.saveButton.current).prop('disabled', false);
          }).catch(error => { global.loader.hideLoader(); global.app.notify('danger','',error); $(this.saveButton.current).prop('disabled', false); });

    }

    render(){
        return(
            <div className="center-form" ref={ this.rootRef }>
            <h2>{ !this.newBook ? "Edit book" : "Add new book" }</h2>
            <form>
                <div className="field">
                  <div className="uploader" >
                    { !this.state.reset ? <FileInput onFileChange={ this.handleFile.bind(this) }></FileInput> : null }
                    { this.state.previewing ? <FilePreview existing={ this.existingImage } file={ this.file } name={ this.fileName } type={ this.fileType } handleFileRemove={ this.resetFile.bind(this) }></FilePreview> : null }
                  </div>
                </div>

                <div className="field">
                    <label htmlFor="title">Title</label><br/>
                    <input className="form-control" id="title" type="text" maxLength="100" defaultValue={ !this.newBook ? this.props.data.title : "" } />
                </div>

                <div className="field">
                    <label htmlFor="user_email">Description</label><br/>
                    <textarea className="form-control" id="description" defaultValue={ !this.newBook ? this.props.data.description : "" } maxLength="1000">
                    </textarea>
                </div>
                <hr/>
                <div className="actions">
                    <input value="Save" className="btn btn-primary" type="button" onClick={ this.saveBook.bind(this) } ref={ this.saveButton }/>
                </div>
            </form>
            </div>
        );
    }    
}


class Book extends React.Component {
  constructor(props){
    super(props);
    this.rootRef = React.createRef();
  }

  componentDidMount(){
    $(this.rootRef.current).find('[data-toggle=confirmation]').confirmation({
        rootSelector: '[data-toggle=confirmation]',
        popout: true,
        singleton: true
    });
    $(this.rootRef.current).find('[data-toggle=tooltip]').tooltip({ boundary: 'window' });
  }
    
  deleteBook(event){
      this.props.deleteBook(this.props.id);
      event.preventDefault();
  }

  detailsBook(event){
      global.modal.showModal(this.props.title,this.props.description);
      event.preventDefault();
  }
  
  editBook(event){
      this.props.editBook({id: this.props.id, title: this.props.title, description: this.props.description, image: this.props.image});
      event.preventDefault();
  }

  render() {
    return (
        <div className="card" ref={ this.rootRef }>
          <img className="card-img-top" src={ this.props.image+"?sync="+Date.now() } />
          <div className="card-body">
          <div className="card-title" data-toggle="tooltip" data-placement="bottom" data-trigger="hover" title={ this.props.title }>{ this.props.title }</div>
          <hr/>
          <div className="card-text">{ this.props.description }</div>
          </div>
          <div className="btn-group card-action d-flex" role="group">
            <button type="button" className="btn btn-success w-30" onClick={ this.editBook.bind(this) } >
              <i className="fa fa-edit"></i>
            </button>
            <button type="button" className="btn btn-primary w-100" onClick={ this.detailsBook.bind(this) } >
              Details
            </button>
            <button type="button" className="btn btn-danger w-30" onClick={ this.deleteBook.bind(this) } data-toggle="confirmation" data-btn-ok-class="btn-success" data-btn-ok-icon-class="fa fa-check" data-btn-cancel-class="btn-danger" data-btn-cancel-icon-class="material-icons" data-title="Are you sure?">
              <i className="fa fa-remove"></i>
            </button>
          </div>
        </div>
    )
  }
}

class BookList extends React.Component {

  /*Constructor*/
  constructor(props){
    super(props);
    if (this.props.data){
        this.state={'books':this.props.data};
        this.state={'books':[]}   //!!!!!!!!!!!!!!!!
    }else{
        this.state={'books':[]}
    }
    this.getListBookUrl=APIUrls['GetListBook'];
    this.deleteBookUrl=APIUrls['DeleteBook'];
  }


  /*Life cycle*/
  componentDidMount() {
    var data={};
    global.loader.showLoader();
    fetch(APIUrls['Book'], {
      cache: 'reload',
      method: 'GET',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
      //body: JSON.stringify(data)
    }).then(response => response.json())
      .then(response=>{
        global.loader.hideLoader(); 
        if (response.success==true){
            this.setState({books:response.data});
        }else{
          if (response.message=='redirect'){
            window.location.replace(response.data);
          }else{
            if (response.message.constructor===Array){
              var mess='';
              $(response.message).each(function(ind,msg){
                if (mess!=''){ mess+='<br>'; }
                mess+=msg;
              });
              global.app.notify('danger','',mess);
            }else{
              global.app.notify('danger','',response.message);
            }
          }
        }
    }).catch(error => {global.loader.hideLoader(); global.app.notify('danger','',error); });
  }

  /*componentWillReceiveProps(newProps){
      this.setState({books:newProps.data});
  }*/

  shouldComponentUpdate(nextProps, nextState){
      if (!global.helpers.isEqual(this.state.books.length,nextProps.data)){
          return true
      }else{
          return false;
      }
  }


  /*Methods*/
  deleteBook(bookId){
    var data={};
    global.loader.showLoader();
    fetch(APIUrls['Book']+'/'+bookId, {
      cache: 'reload',
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
      //body: JSON.stringify(data)
    }).then(response => response.json())
      .then(response=>{
        global.loader.hideLoader(); 
        if (response.success==true){
            var index=null;
            var newList=this.state.books.slice(0);
            newList.some(function(item,ind){ if (item.id==bookId) { index=ind; return true; }else{ return false; } });
            if (index!=null){
                newList.splice(index,1);
                this.setState({books:newList})
            }
            global.app.notify('success','','Book deleted succesfully.');
        }else{
          if (response.message=='redirect'){
            window.location.replace(response.data);
          }else{
            if (response.message.constructor===Array){
              var mess='';
              $(response.message).each(function(ind,msg){
                if (mess!=''){ mess+='<br>'; }
                mess+=msg;
              });
              global.app.notify('danger','',mess);
            }else{
              global.app.notify('danger','',response.message);
            }
          }
        }
    }).catch(error => { global.loader.hideLoader(); global.app.notify('danger','',error); });
  }

  editBook(bookData){
      this.props.changeComponent('NewBook',bookData);
  }

  render() {
      return (
        <div id='books'>
            { this.state.books.map(function(book, index){ return <Book key={ index } id={ book.id } title={book.title} image={book.image} description={book.description} noImage={this.props.noImage} deleteBook={ this.deleteBook.bind(this) } editBook={ this.editBook.bind(this) } />}.bind(this)) }
        </div>
    )
  }
}