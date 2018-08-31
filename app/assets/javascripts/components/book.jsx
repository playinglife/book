
class NewBook extends React.Component{
    constructor(props){
        super(props);
        this.rootRef = React.createRef();
        this.fileInput = React.createRef();

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
        this.duplicate=this.duplicate.bind(this);
        this.enableButtons=this.enableButtons.bind(this);
        this.disableButtons=this.disableButtons.bind(this);
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
      /*If key is set on application.jsx where component is loaded then this method will not be called because a new component will be created
        if (someProps.data && someProps.data.book && typeof someProps.data.book.id!='undefined'){
            this.newBook=false;
            if (someProps.data){
              if (typeof someProps.data.title!='undefined'){ this.setState(someProps.data); }
            }
        }else{
            this.newBook=true;
            this.setState({
              book: null,
              images: [],
              cover: null
            });
            $(this.rootRef.current).find('#title').val(typeof someProps.data.title!='undefined' ? someProps.data.title : '');
            $(this.rootRef.current).find('#author').val(typeof someProps.data.author!='undefined' ? someProps.data.author : '');
            $(this.rootRef.current).find('#description').val(typeof someProps.data.description!='undefined' ? someProps.data.description : '');
            $(this.rootRef.current).find('#quantity').val(typeof someProps.data.quantity!='undefined' ? someProps.data.quantity : '');
        }*/
    }    

    componentDidMount(){
      var self=this;
      if (this.newBook){
        self.disableButtons();
        var self=this;
        global.fetch(APIUrls['Book'], 'POST', {}, {
          callbackSuccess:function(response){
            self.newBook=false;
            self.setState({book: response.data, images: [], cover: null});
          },
          callbackFailure:function(){},
          callbackError:function(){},
          callbackAll:function(){
            self.enableButtons();
          }
        });
      }
      

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
              callbackFailure:function(){},
              callbackError:function(){}
            });

          }
        });

      $(this.rootRef.current).find('#authorBirthday').datetimepicker({
        format: 'MM/DD/YYYY',
        viewMode: 'years'
      });
    }

    disableButtons(){
      $(this.rootRef.current).find('input[type=button]').prop('disabled', true);
    }
    enableButtons(){
      $(this.rootRef.current).find('input[type=button]').prop('disabled', false);
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
        callbackFailure:function(){},
        callbackError:function(){}
      });          
    }

    handleFile(filesObj){
      var fileList=[];
      var totalFiles=filesObj.length;
      var processedFiles=0;
      
      var processFile=function(fileObj){
        var reader = new FileReader();
        //this.fileName = fileObj.name;
        //this.fileType = fileObj.type;

        reader.onload = function(e) {
          processedFiles++;
          fileList.push(reader.result);

          if (processedFiles==totalFiles){
            var root=$(this.rootRef.current);
            let data = new FormData()
            
            for (var j=0;j<fileList.length;j++){
              data.append('files[]', fileList[j]);
            }

            var self=this;
            global.fetch(APIUrls['Book']+'/'+this.state.book.id, 'PUT', data, {
              callbackSuccess:function(response){

                var newList=self.state.images;
                for (var k=0;k<response.data.newImages.length;k++){
                  newList.push(response.data.newImages[k]);
                }
                if (newList.length<fileList.length){
                  var total=fileList.length;
                  var saved=newList.length;
                  global.app.showResponseMessages(response);
                  global.app.notify('success','','From a total of '+total+(total>1 ? ' images' : ' image')+', '+saved+(saved>1 ? ' were' : 'was')+' saved and '+(total-saved)+' could not be saved.');
                }else{
                  global.app.notify('success','',(response.data.newImages.length>1 ? 'Images' : 'Image')+' succesfully added');
                }
                self.setState({images: newList})
              },
              callbackFailure:function(){},
              callbackError:function(){}
            });
          }
        }.bind(this);
        reader.readAsDataURL(fileObj.file);
      }.bind(this);
      
      for (var i=0;i<totalFiles;i++){
        processFile(filesObj[i]);
      }
    }

    saveBook(){
        this.disableButtons();
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
            self.props.changeComponent('BookList',{mine: true});
          },
          callbackFailure:function(){},
          callbackError:function(){},
          callbackAll:function(){
            self.enableButtons();
          }
        });
    }
    
    duplicate(){
      this.disableButtons();
      var url=APIUrls['DuplicateBook']+'/'+this.state.book.id;
      var method='POST';

      var root=$(this.rootRef.current);

      var self=this;
      global.fetch(url, method, {}, {
        callbackSuccess:function(response){
          global.app.notify('success','','Book succesfully duplicated.<br>You are now editing the new copy of the book.');
          self.props.changeComponent('NewBook',{book: response.data});
        },
        callbackFailure:function(){},
        callbackError:function(){},
        callbackAll:function(){
          self.enableButtons();
        }
      });    
    }
    
    cancelKeys(event){
      event.preventDefault();
      event.stopPropagation();
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
                        <div className="input-group date" id="authorBirthday" data-target-input="nearest">
                            <input type="text" className="form-control datetimepicker-input" data-target="#authorBirthday" onKeyDown={ this.cancelKeys }/>
                            <div className="input-group-append btn btn-primary" data-target="#authorBirthday" data-toggle="datetimepicker">
                                <div className=""><i className="fa fa-calendar"></i></div>
                            </div>
                        </div>
                    </div>                        
                  </div>

                  <div className="field">
                      <label>Description</label><br/>
                      <textarea className="form-control" id="description" defaultValue={ !this.newBook ? this.state.book.description : "" } maxLength="1000">
                      </textarea>
                  </div>
                  <hr/>
                  <div className="actions">
                    <input value="Cancel" className="btn btn-secondary pull-left maxer" type="button" onClick={ this.props.cancel } />
                    <div className="btn-group pull-right maxer" role="group" aria-label="Basic example">
                      <input value="Duplicate" className="btn btn-primary maxer" type="button" onClick={ this.duplicate } data-toggle="confirmation" data-title="Please confirm you want to duplicate this book"/>
                      { !this.newBook ? <input value="Save" className="btn btn-primary maxer" type="button" onClick={ this.saveBook.bind(this) } /> : '' }
                    </div>
                  </div>
              </form>
              <div className="clearfix"></div>
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
                    <ImageGallery images={ this.state.images } cover={ !this.newBook ? this.state.cover : null } setToCover={ this.setToCover } deleteImage={ this.deleteImage } mine={ this.props.data.mine }/>
                  </div>
                </form>
               : '' }
              <div className="clearfix"></div>
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
    
    this.editOrBorrowBook=this.editOrBorrowBook.bind(this);
  }

  componentDidMount(){
    $(this.rootRef.current).find('[data-toggle=confirmation]').confirmation({
        rootSelector: '[data-toggle=confirmation]',
        popout: true,
        singleton: true
    });
    $(this.rootRef.current).find('[data-toggle=tooltip]').tooltip({ boundary: 'window', trigger : 'hover' });
  }
  
  componentDidUpdate(){
    $(this.rootRef.current).find('[data-toggle=tooltip]').tooltip({ boundary: 'window', trigger : 'hover' });
  }
  
  componentWillReceiveProps(someProps) {
    if (someProps.filter){
      if (someProps.filter.query!=null && someProps.filter.query.trim!=''){
        var regexp=new RegExp(someProps.filter.query, "i");
        if (this.props.book.title.match(regexp) || this.props.book.description.match(regexp) || (this.props.book.author!=null) && this.props.book.author.match(regexp)) {
          //LIKE someProps.filter || this.props.description LIKE someProps.filter || this.props.author LIKE someProps.filter ){
          this.filteredOut=false;
        }else{
          this.filteredOut=true;
        }
      }else{
        this.filteredOut=false;
      }
      if (this.filteredOut==false && someProps.filter.option!='All' && ( (someProps.filter.option=='GivenTaken' && this.props.book.givenTaken==false) || (someProps.filter.option=='NotGivenTaken' && this.props.book.givenTaken==true) ) ){
        this.filteredOut=true;
      }
    }
  }    
    
  getCoverUrl(){
    if (this.props.book.cover!=null){
      var coverId=this.props.book.cover;
      var img=this.props.book.images.find(function(img){ return img.id==coverId});
      if (typeof img=='undefined'){
        return this.props.noImage;
      }else{
        return img.name.url;
      }
    }else{
      return this.props.noImage;
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
  
  editOrBorrowBook(event){
    $(this.rootRef.current).find('[data-toggle=tooltip]').tooltip('hide');
    if (this.props.mine==true){
      this.props.editBook({book: this.props.book, mine: this.props.mine} );
    }else{
      this.props.borrowBook({book: this.props.book, mine: this.props.mine} );
    }
    event.preventDefault();
    
  }

  render() {
    if (this.filteredOut==false){
      return (
          <div className="panel card" ref={ this.rootRef } onClick={ this.editOrBorrowBook }>
            { this.props.book.givenTaken==true ?
              this.props.mine==false ?
                <div className="corner-ribbon red shadow" data-toggle="tooltip" data-placement="bottom" data-trigger="hover" title="Not available">
                  <i className="fa fa-ban">
                  </i>
                </div>
              :
                <div className="corner-ribbon blue shadow" data-toggle="tooltip" data-placement="bottom" data-trigger="hover" title="Lended">
                  <i className="fa fa-user">
                  </i>
                </div>
            : null }
            <div className="image">
              <img className="card-img-top" src={ this.getCoverUrl()+"?sync="+Date.now() } />
            </div>
            <div className="card-body">
            <div className={ this.props.book.title.length>0 ? "card-title" : "card-title no-title" } data-toggle="tooltip" data-placement="bottom" data-trigger="hover" title={ this.props.book.title }>{ this.props.book.title.length>0 ? this.props.book.title : 'No Title'}</div>
            </div>
            { this.props.mine==true ?
              <button type="button" className="btn btn-danger w-30 card-action-delete pull-right" onClick={ this.deleteBook.bind(this) } data-toggle="confirmation" data-btn-ok-class="btn-success" data-btn-ok-icon-class="fa fa-check" data-btn-cancel-class="btn-danger" data-btn-cancel-icon-class="material-icons" data-title="Are you sure?">
                <i className="fa fa-remove"></i>
              </button>
            : 
              null
            }
          </div>
      )
    }else{
      return null;
    }
  }
}



class BookList extends React.Component {
  constructor(props){
    super(props);
    if (this.props.data){
        this.state={
          books:this.props.data,
          filter: null, //null if there is no filer, query if there is a filter
          showFilter: false,
          mine: this.props.data.mine  //Shows if my books are displayed or other peoples' books are displayed
        };
        this.state={
          books:null, //The list of books is empty and will be populated through a GET request
          filter: null, //null if there is no filer, query if there is a filter
          showFilter: false,
          mine: this.props.data.mine
        }
    }else{
        this.state={
          books:null,
          filter: null, //null if there is no filer, query if there is a filter
          showFilter: false,
          mine: this.props.data.mine
        }
    }
    this.getListBookUrl=APIUrls['GetListBook'];
    this.deleteBookUrl=APIUrls['DeleteBook'];
    
    this.filter=this.filter.bind(this);
    this.toggleFilter=this.toggleFilter.bind(this);
    this.reloadData=this.reloadData.bind(this);
    this.editBook=this.editBook.bind(this);
    this.borrowBook=this.borrowBook.bind(this);
  }


  /*Life cycle*/
  componentDidMount() {
    this.reloadData();
  }
  
  componentWillReceiveProps(newProps, newState){
      if (this.state.mine!=newProps.data.mine){
        this.setState({mine: newProps.data.mine});
      }
  }

  componentDidUpdate(prevProps, prevState){
    if (this.state.mine!=prevState.mine){
      this.reloadData();
    }
  }

  shouldComponentUpdate(nextProps, nextState){
      if ( (this.state.books==null) || (!global.helpers.isEqual(this.state.books.length,nextProps.data)) || (this.state.mine!=nextProps.data.mine)){
          return true
      }else{
          return false;
      }
  }


  /*Methods*/
  reloadData(){
    var self=this;
    var data={};
    
    global.fetch(this.state.mine==true ? APIUrls['Book'] : APIUrls['BookOthers'], 'GET', null, {
      callbackSuccess:function(response){
        self.setState({books:response.data});
      },
      callbackFailure:function(){
        self.setState({books:null});
      },
      callbackError:function(){
        self.setState({books:null});
      }
    });        
  }
  
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
      callbackFailure:function(){},
      callbackError:function(){}
    });    
  }

  editBook(bookData){
      this.props.changeComponent('NewBook',bookData);
  }
  borrowBook(bookData){
      this.props.changeComponent('BorrowBook',bookData);
  }

  cancelNewEdit(){
    
  }

  filter(filter){
    this.setState({filter: filter});
  }
  toggleFilter(show){
    if (show==true){
      this.setState({showFilter: true});
    }else{
      this.setState({showFilter: false, filter: {query: null, option: 'All'} });
    }
  }
  
  render() {
    if (this.state.books!=null){
      if (this.state.books.length>0){
        return (
          <div id='books'>
            { this.state.books.map(function(book, index){ return <Book key={ index } book={ book } noImage={this.props.noImage} deleteBook={ this.deleteBook.bind(this) } editBook={ this.editBook } borrowBook={ this.borrowBook } filter={ this.state.filter } mine={ this.state.mine }/>}.bind(this)) }
            <Search filter={ this.state.filter } mine={ this.state.mine } showFilter={ this.state.showFilter } onFilter={ this.filter } toggleFilter={ this.toggleFilter }/>
          </div>
        )
      }else{
        return (
          <div id='books'>
            <div className='no-books'>
              { this.state.mine ? 
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
              :
                <div>
                  <div>
                    There are no public books from other users<br /><br />
                  </div>
                </div>
              }
            </div>
          </div>
        )
      }
    }else{
      return( <div></div> )
    }
  }
}
BookList.defaultProps={
  
}
BookList.propTypes={
}

BorrowList=BookList; //Alias for the menu to be able to show the active menu item