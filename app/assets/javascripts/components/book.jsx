APIUrls['Book']=window.origin+'/books';
APIUrls['DeleteImage']=window.origin+'/books/destroyImage';
APIUrls['AuthorTypeahead']=window.origin+'/authors/typeahead';

class NewBook extends React.Component{
    constructor(props){
        super(props);
        this.rootRef = React.createRef();
        this.fileInput = React.createRef();
        this.saveButton = React.createRef();

        if (this.props.data.book && typeof this.props.data.book.id!='undefined'){
            this.newBook=false;
            this.state={
              book: this.props.data.book,
              images: this.props.data.book.images,
              cover: this.props.data.book.cover
            };
        }else{
            this.newBook=true;
            this.state={
              book: null,
              images: [],
              cover: null
            };
        }
        
        this.newAuthor=false;
        
        this.getCoverUrl=this.getCoverUrl.bind(this);
        this.setToCover=this.setToCover.bind(this);
        this.deleteImage=this.deleteImage.bind(this);
    }

    getCoverUrl(coverId){
      var img=this.state.images.find(function(img){ return img.id==coverId});
      if (typeof img=='undefined'){
        return this.props.noImage;
      }else{
        return img.name.url;
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
        if (typeof someProps.data.book.id!='undefined'){
            this.newBook=false;
        }else{
            this.newBook=true;
        }
        $(this.rootRef.current).find('#title').val(typeof someProps.data.title!='undefined' ? someProps.data.title : '');
        $(this.rootRef.current).find('#description').val(typeof someProps.data.description!='undefined' ? someProps.data.description : '');
    }    

    componentDidMount(){
      var self=this;
      if (this.newBook){
        $(this.saveButton.current).prop('disabled', true);
        var self=this;
        global.fetch(APIUrls['Book'], 'POST', {}, {
          callbackSuccess:function(response){
            self.newBook=false;
            self.setState({book: response.data, images: [], cover: null});
          },
          callbackFailure:function(){

          },
          callbackError:function(){

          }
        });
      }
      
      if (!this.newBook){
        $(this.rootRef.current).find('#author').on('keydown',function(){
          self.newAuthor=true;
          $(self.rootRef.current).find('#authorBirthdayGroup').show();
        });
        
        $(this.rootRef.current).find('#author').on('typeahead:selected', function(ev, suggestion) {
          $(self.rootRef.current).find('#author_id').val(suggestion.id);
          self.newAuthor=false;
          $(self.rootRef.current).find('#authorBirthdayGroup').hide();
        }).typeahead(
          {},{
            display: 'value',
            source: function(query, result){
              global.fetch(APIUrls['AuthorTypeahead']+'/'+query, 'GET', null, {
                lock: false,
                callbackSuccess:function(response){
                  let list=[];
                  list=$.map(response.data, function(item){
                    item.value=item.firstname+' '+item.lastname;
                    return item;
                  })
                  result(list);
                },
                callbackFailure:function(){
                },
                callbackError:function(){
                }
              });

            }
          });
          
        $(this.rootRef.current).find('#authorBirthday').datetimepicker();
      }
    }

    setToCover(id){
      this.setState({cover: id});
    }

    deleteImage(id){
      var self=this;

      global.fetch(APIUrls['DeleteImage']+'/'+id, 'DELETE', null, {
        callbackSuccess:function(){
          var index=null;
          var newList=self.state.images.slice(0);
          newList.some(function(item,ind){ if (item.id==id) { index=ind; return true; }else{ return false; } });
          if (self.state.cover==id){
            self.setToCover(null);
          }

          if (index!=null){
              global.app.notify('success','','Image deleted succesfully.');
              newList.splice(index,1);
              self.setState({images:newList})
          }
        },
        callbackFailure:function(){
        },
        callbackError:function(){
        }
      });          
    }

    handleFile(fileObj){
      var reader = new FileReader();

      this.fileName = fileObj.name;
      this.fileType = fileObj.type;

      reader.onload = function(e) {
        this.file = reader.result;
        
        var root=$(this.rootRef.current);
        let data = new FormData()
        data.append('file', this.file);

        var self=this;
        global.fetch(APIUrls['Book']+'/'+this.state.book.id, 'PUT', data, {
          callbackSuccess:function(response){
            
            var newList=self.state.images;
            newList.push(response.data.newImage);
            global.app.notify('success','','Image succesfully added');
            self.setState({images: newList})
          },
          callbackFailure:function(){},
          callbackError:function(){}
        });
        
      }.bind(this);
      reader.readAsDataURL(fileObj.file);
    }

    saveBook(){
        $(this.saveButton.current).prop('disabled', true);
        var url=APIUrls['Book']+'/'+this.state.book.id;
        var method='PUT';
        
        var root=$(this.rootRef.current);
        
        let data = new FormData()
        data.append('title', root.find('#title').val());
        data.append('description', root.find('#description').val());
        data.append('author', root.find('#author').val());
        
        //!!!
        //data.append('birthday', root.find('#authorBirthday').val());
        data.append('birthday', '10/10/1980');
        
        data.append('quantity', root.find('#quantity').val());
        if (this.state.cover!=null){
          data.append('cover', this.state.cover);
        }
        
        var self=this;
        global.fetch(url, method, data, {
          callbackSuccess:function(){
            global.app.notify('success','','Book succesfully updated');
            var obj=self.state.book;
            obj.title=data.title;
            obj.description=data.description;
            self.setState({book: obj});
            $(self.saveButton.current).prop('disabled', false);
          },
          callbackFailure:function(){
            $(self.saveButton.current).prop('disabled', false);
          },
          callbackError:function(){
            $(self.saveButton.current).prop('disabled', false); 
          }
        });
    }
    
    render(){
        return(
          <div className="center-panel">
            <div className="panel child-panel" ref={ this.rootRef }>
            <h3>Edit book</h3>
            <form>
                <div className="field">
                  <div className="uploader" >
                    <FilePreview existing={ this.getCoverUrl(this.state.cover) } onlyView={ true } ></FilePreview>
                  </div>
                </div>

                <div className="field">
                    <label>Title</label><br/>
                    <input className="form-control" id="title" type="text" maxLength="100" defaultValue={ !this.newBook ? this.state.book.title : "" } />
                </div>
                <div className="field">
                    <label>Author</label><br/>
                    <input id="author_id" type="hidden" />
                    <input className="form-control typeahead" id="author" type="text" defaultValue={ !this.newBook ? this.state.book.author : "" }/>
                </div>

                <div className="field" id='authorBirthdayGroup'>
                  <label>New author's birthday</label><br/>
                        <div className="form-group">                  
                          <div className='input-group date' id='authorBirthday'>
                            <input type='text' className="form-control" />
                            <span className="input-group-addon">
                                <span className="glyphicon glyphicon-calendar"></span>
                            </span>
                          </div>
                        </div>
                </div>
                  
                <div className="field">
                    <label>Description</label><br/>
                    <textarea className="form-control" id="description" defaultValue={ !this.newBook ? this.state.book.description : "" } maxLength="1000">
                    </textarea>
                </div>
                <div className="field">
                    <label>Quantity</label><br/>
                    <input className="form-control" id="quantity" defaultValue={ !this.newBook ? this.state.book.quantity : "" } />
                </div>
                <hr/>
                <div className="actions">
                    <input value="Back" className="btn btn-primary pull-left" type="button" onClick={ this.props.cancel } />
                    { !this.newBook ? <input value="Save" className="btn btn-primary pull-right" type="button" onClick={ this.saveBook.bind(this) } ref={ this.saveButton }/> : '' }
                </div>
            </form>
            </div>
            
            <div className="panel child-panel">
              <h3>Add an image </h3>
              { !this.newBook ?
                <form>
                  <div className="field">
                    <div className="uploader" >
                      <FileInput onFileChange={ this.handleFile.bind(this) }></FileInput>
                    </div>
                  </div>
                  <h3>Select cover image</h3>
                  <div className="field">
                    <ImageGallery images={ this.state.images } cover={ !this.newBook ? this.state.cover : null } setToCover={ this.setToCover } deleteImage={ this.deleteImage } />
                  </div>
                </form>
               : '' }
            </div>
          </div>
        );
    }    
}



class Book extends React.Component {
  constructor(props){
    super(props);
    this.rootRef = React.createRef();
    
    this.filteredOut=false;
    
    this.getCoverUrl=this.getCoverUrl.bind(this);        
  }

  componentDidMount(){
    $(this.rootRef.current).find('[data-toggle=confirmation]').confirmation({
        rootSelector: '[data-toggle=confirmation]',
        popout: true,
        singleton: true
    });
    $(this.rootRef.current).find('[data-toggle=tooltip]').tooltip({ boundary: 'window' });
  }
    
  componentWillReceiveProps(someProps) {
      if (someProps.filter!=null && someProps.filter.trim!=''){
        var regexp=new RegExp(someProps.filter, "i");
        if (this.props.book.title.match(regexp) || this.props.book.description.match(regexp) || this.props.book.author.match(regexp)){
          //LIKE someProps.filter || this.props.description LIKE someProps.filter || this.props.author LIKE someProps.filter ){
          this.filteredOut=false;
        }else{
          this.filteredOut=true;
        }
      }else{
        this.filteredOut=false;
      }
  }    
    
  getCoverUrl(){
    var coverId=this.props.book.cover;
    var img=this.props.book.images.find(function(img){ return img.id==coverId});
    if (typeof img=='undefined'){
      return this.props.noImage;
    }else{
      return img.name.url;
    }
  }  
    
  deleteBook(event){
    event.preventDefault();
    event.stopPropagation();
      this.props.deleteBook(this.props.book.id);
  }

  /*detailsBook(event){
    
      global.modal.showModal(this.props.title,this.props.description);
      event.preventDefault();
  }*/
  
  editBook(event){
      this.props.editBook({book: this.props.book} );
      event.preventDefault();
  }

  render() {
    if (this.filteredOut==false){
      return (
          <div className="panel card" ref={ this.rootRef } onClick={ this.editBook.bind(this) }>
            <div>
              <img className="card-img-top" src={ this.getCoverUrl()+"?sync="+Date.now() } />
            </div>
            <div className="card-body">
            <div className="card-title" data-toggle="tooltip" data-placement="bottom" data-trigger="hover" title={ this.props.book.title }>{ this.props.book.title }</div>
            </div>
            <button type="button" className="btn btn-danger w-30 card-action-delete pull-right" onClick={ this.deleteBook.bind(this) } data-toggle="confirmation" data-btn-ok-class="btn-success" data-btn-ok-icon-class="fa fa-check" data-btn-cancel-class="btn-danger" data-btn-cancel-icon-class="material-icons" data-title="Are you sure?">
              <i className="fa fa-remove"></i>
            </button>
          </div>
      )
    }else{
      return null;
    }
  }
}

class BookList extends React.Component {

  /*Constructor*/
  constructor(props){
    super(props);

    if (this.props.data){
        this.state={
          'books':this.props.data,
          'filter': null, //null if there is no filer, query if there is a filter
          'showFilter': false
        };
        this.state={
          'books':null, //The list of books is empty and will be populated through a GET request
          'filter': null, //null if there is no filer, query if there is a filter
          'showFilter': false
        }
    }else{
        this.state={
          'books':null,
          'filter': null, //null if there is no filer, query if there is a filter
          'showFilter': false
        }
    }
    this.getListBookUrl=APIUrls['GetListBook'];
    this.deleteBookUrl=APIUrls['DeleteBook'];
    
    this.filter=this.filter.bind(this);
    this.toggleFilter=this.toggleFilter.bind(this);
  }


  /*Life cycle*/
  componentDidMount() {
    var self=this;
    var data={};
    
    global.fetch(APIUrls['Book'], 'GET', null, {
      callbackSuccess:function(response){
        self.setState({books:response.data});
      },
      callbackFailure:function(){
        $(self.saveButton.current).prop('disabled', false);
        self.setState({books:null});
      },
      callbackError:function(){
        $(self.saveButton.current).prop('disabled', false); 
        self.setState({books:null});
      }
    });    
  }
  
  /*componentWillReceiveProps(newProps){
      this.setState({books:newProps.data});
  }*/

  shouldComponentUpdate(nextProps, nextState){
      if ( (this.state.books==null) || (!global.helpers.isEqual(this.state.books.length,nextProps.data)) ){
          return true
      }else{
          return false;
      }
  }


  /*Methods*/
  deleteBook(bookId){
    var self=this;
    var data={};
    
    global.fetch(APIUrls['Book']+'/'+bookId, 'DELETE', null, {
      callbackSuccess:function(){
        var index=null;
        var newList=self.state.books.slice(0);
        newList.some(function(item,ind){ if (item.id==bookId) { index=ind; return true; }else{ return false; } });
        if (index!=null){
            newList.splice(index,1);
            self.setState({books:newList})
        }
        global.app.notify('success','','Book deleted succesfully.');
      },
      callbackFailure:function(){
        $(self.saveButton.current).prop('disabled', false);
      },
      callbackError:function(){
        $(self.saveButton.current).prop('disabled', false); 
      }
    });    
  }

  editBook(bookData){
      this.props.changeComponent('NewBook',bookData);
  }

  cancelNewEdit(){
    
  }

  filter(query){
    this.setState({filter: query});
  }
  toggleFilter(show){
    if (show==true){
      this.setState({showFilter: true});
    }else{
      this.setState({showFilter: false, filter: null});
    }
  }
  
  render() {
    if (this.state.books!=null){
      if (this.state.books.length>0){
        return (
          <div id='books'>
            { this.state.books.map(function(book, index){ return <Book key={ index } book={ book } noImage={this.props.noImage} deleteBook={ this.deleteBook.bind(this) } editBook={ this.editBook.bind(this) } filter={ this.state.filter } />}.bind(this)) }
            <Search filter={ this.state.filter } showFilter={ this.state.showFilter } onFilter={ this.filter } toggleFilter={ this.toggleFilter }/>
          </div>
        )
      }else{
        return (
          <div id='books'>
            <div className='no-books'>
              <div>
                <div>
                You have no books in your list<br />
                Add a book now<br /><br />
                </div>
                <div>
                <button className="btn btn-primary" onClick={ this.props.addNewBook } >
                  <i className="fa fa-plus add-new-book-button"></i>
                </button>
                </div>
              </div>
            </div>
          </div>
        )
      }
    }else{
      return( <div></div> )
    }
  }
}