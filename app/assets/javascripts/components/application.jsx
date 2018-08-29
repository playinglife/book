var APIUrls={}
APIUrls['Login']=window.origin+'/users/sign_in';
APIUrls['Signup']=window.origin+'/users';
APIUrls['Forgot']=window.origin+'/users/password';
APIUrls['Reset']=window.origin+'/users/password';
APIUrls['Unlock']=window.origin+'/users/unlock';
APIUrls['Logout']=window.origin+'/users/sign_out';

APIUrls['Book']=window.origin+'/books';
APIUrls['DeleteImage']=window.origin+'/books/destroyImage';
APIUrls['AuthorTypeahead']=window.origin+'/authors/typeahead';

APIUrls['BookOthers']=window.origin+'/books/others';
APIUrls['BorrowBook']=window.origin+'/books/borrow';
APIUrls['ReturnBook']=window.origin+'/books/return';

var global={
    app: null   /*Will be set in application didMount event*/
}

//const authenticityToken={ authenticityToken };

/*type ApplicationProps={
  component:            string,
  data:                 Array,
  user:                 Object,
  loggedIn:             boolean,
  reset_password_token: string,
  unlock_token:         string
  //attr? - optional. Others need to be provided.
}*/

class Application extends React.Component {
  
/*  static defaultProps(){
    return{
      user: null,
      loggedIn: false,
      reset_password_token: null,
      unlock_token:         null
    }
  }*/
  
  /*Constructor*/
  constructor(props){
    super(props);
    this.state={
      data: this.props.data,
      component: this.props.component!==undefined?this.props.component:null,
      loggedIn: this.props.loggedIn,
      menuActive: 1,
    }
    
    this.rootRef = React.createRef();
    this.menuRef = React.createRef();
    this.burgerRef= React.createRef();
      
    this.unlockToken=this.props.unlock_token;
    this.resetPasswordToken=this.props.reset_password_token;
    this.showMenu=false;
    this.firstRun=true;
    this.menuOrder={BookList: 1,BorrowList: 2};    
    
    this.changeComponent.bind(this);
    this.loadComponent.bind(this);
    this.notify.bind(this);
    this.login.bind(this);
    this.cancel.bind(this);
    this.addNewBook=this.addNewBook.bind(this);
    this.toggleMenu=this.toggleMenu.bind(this);
    this.showResponseMessages=this.showResponseMessages.bind(this);
    this.handleOutsideClick=this.handleOutsideClick.bind(this);
    
    global.app=this;
    global.csrf=$('meta[name="csrf-token"]').attr('content');
  }

  componentWillMount(){
    var self=this;
    global.fetch=function(url, method, data, passedSettings){
      var headers;
      var settings={
        lock: true
      }
      $.extend(settings, passedSettings);

      var options={
        cache: 'reload',
        method: method,
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json',
          'X-CSRF-Token': global.csrf
        }
      }

      if (settings.lock){ global.loader.showLoader(); }

      if (data!=null){
        if (!(data!=null && (typeof data.append=='function'))){
          options.headers['Content-Type']='application/json';
          options.body=JSON.stringify(data);
        }else{
          if (method!='GET'){
            options.body=data;
          }      
        }
      }

      fetch(url, options)
      .then(response => { headers=response.headers; return response.json(); })
      .then(response =>{
        if (settings.lock){ global.loader.hideLoader(); }
        if (response && response.success==true){
          if (typeof settings.callbackSuccess=='function') { settings.callbackSuccess(response, headers); } 
        }else{
          if (response && response.message=='redirect'){
            window.location.replace(response.data);
          }else{
            self.showResponseMessages(response);
            if (typeof settings.callbackFailure=='function') { settings.callbackFailure(response, headers); } 
          }
        }
      })
      .catch(error => {
        global.loader.hideLoader(); 
        if (typeof settings.callbackError=='function') { 
          settings.callbackError(error, headers); 
        }else{
          global.app.notify('danger','',error); 
        }
      });
    }    
    
  }
  
  /*Life cycles*/
  componentDidCatch(error, info){
  }

  componentDidMount() {
    this.unlockToken=null;
    this.resetPasswordToken=null;
    document.addEventListener('click', this.handleOutsideClick, false);
  }
  
  toggleMenu(){
    this.showMenu=!this.showMenu;
    $(this.menuRef.current).toggleClass('show');
    $(this.burgerRef.current).toggleClass('show');
  }
  
  showResponseMessages(response){
    if (response && response.message && response.message!=''){
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
  
  addNewBook(){
    this.changeComponent('NewBook', {});
  }
  
  changeComponent(what,data,event){
    if (this.state.component!=what || !global.helpers.isEqual(this.state.data,data)/* || !global.helpers.emptyObject(data)*/){
      //if (this.lastComponent!=this.state.component && this.lastComponentData!=this.state.data){
      this.lastComponent=this.state.component;
      this.lastComponentData=this.state.data;
      //}
      this.setState({component: what,data: data, menuActive: typeof this.menuOrder[what]!='undefined' ? this.menuOrder[what] : 0 });
    }
    if (event){
        event.preventDefault();
    }
  }    
  
  cancel(event){
    this.setState({component: this.lastComponent});
    if (event){
        event.preventDefault();
    }
  }
  
  /*shouldComponentUpdate(nextProps, nextState){
      if (this.state.component!=nextState.component){
          return true
      }else{
          return false;
      }
  }*/

  /*Methods*/
  loadComponent(){
    var ComponentName=eval(this.state.component);
    return ( <ComponentName key={ Date.now() } data={ this.state.data } cancel={ this.cancel.bind(this) } changeComponent={ this.changeComponent.bind(this) } noImage={ this.props.noImage } addNewBook={ this.addNewBook }/> );
  }

  notify(type,title,message){
    $.notify({
            icon: '',
            title: title,
            message: message,
            target: '_blank'
    },{
	element: 'body',
	position: null ,
	type: type,
	allow_dismiss: true,
	newest_on_top: false,
	showProgressbar: false,
	placement: {
		from: "top",
		align: "right"
	},
	offset: 0,
	spacing: 1,
	z_index: 1031,
	delay: 5000,
	timer: 1000,
	url_target: '_blank',
	mouse_over: 'pause',
	animate: {
		enter: 'animated fadeInDown',
		exit: 'animated fadeOutUp'
	},
	onShow: null,
	onShown: null,
	onClose: null,
	onClosed: null,
	icon_type: 'class'
    });      
  }

  cancelOnDrop(event){
    event.preventDefault();
    event.stopPropagation();
  }

  login(){
    this.setState({loggedIn: true});
  }
  
  logout(event){
    var self=this;
    event.preventDefault();
    global.fetch(APIUrls['Logout'], 'DELETE', null, {
      callbackSuccess:function(response){},
      callbackFailure:function(response, headers){
        global.csrf=headers.get('Toki')
        self.setState({loggedIn: false});
      },
      callbackError:function(error, headers){
        global.csrf=headers.get('Toki')
        self.setState({loggedIn: false});
      }
    });
  }
  
  handleOutsideClick(e){
    if (/*(this.menuRef.current.contains(e.target) || */this.burgerRef.current.contains(e.target)) {
      return;
    }
    if (this.showMenu==true){
      this.toggleMenu();
    }
  }
  
  render() {
    if (this.state.loggedIn){
      return (
        <div id="container" onDrop={ this.cancelOnDrop.bind(this) } onDragOver={ this.cancelOnDrop.bind(this) } >
            <div ref={ this.menuRef } className={ this.showMenu ? "show" : "" }>
              <ul className="sidebar-nav">
                  <li className="sidebar-brand">
                      <img src={this.props.logo} />
                      <a href='' onClick={ this.changeComponent.bind(this, 'NewBook', {}) }>
                          <i className="fa fa-plus add-new-book-button"></i>
                      </a>
                  </li>
                  <li>
                      <a className={ this.state.menuActive==this.menuOrder['BookList'] ? "active" : "" } href='' onClick={ this.changeComponent.bind(this, 'BookList', {mine: true}) }>My Books</a>
                  </li>
                  <li>
                      <a className={ this.state.menuActive==this.menuOrder['BorrowList'] ? "active" : "" } href='' onClick={ this.changeComponent.bind(this, 'BorrowList', {mine: false}) }>My friends' books</a>
                  </li>
                  <li>
                  <a rel="nofollow" href="" onClick={ this.logout.bind(this) }>Sign out</a>
                  </li>
              </ul>
            </div>
            <div id="the-content">
            { this.state.component!==null ? this.loadComponent() : null }
            </div>

            <div ref={ this.burgerRef } className={ this.showMenu ? "" : "show" } onClick={ this.toggleMenu }>
              <i className="fa fa-bars" data-toggle="tooltip" title="Show menu"></i>
            </div>

            <Loader />
            <div className=".notifications.top-right"></div>
            <ModalWin />
        </div>
      );
    }else{
      return(
        <div>
          <Authorize unlockToken={ this.unlockToken } resetPasswordToken={ this.resetPasswordToken } onLogin={ this.login.bind(this) }/>
          <Loader />
          <div className=".notifications.top-right"></div>
          <ModalWin />
        </div>
      );
    }
  }
}

class Loader extends React.Component{
    constructor(props){
      super(props);
      global.loader=this;
      this.state={loading:false};
      this.loaders=0;     /*Loaders requested count*/
      this.delayLoading=null;
      this.showLoader.bind(this);
      this.hideLoader.bind(this);
    }
    componentWillReceiveProps(someProps) {
      this.setState({});
    }    
    showLoader(event){
        this.loaders++;
        if (this.state.loading==false){
          this.delayLoader=setTimeout(function(){ this.setState({loading : true}); }.bind(this),1000);
        }
    }
    hideLoader(event){
        if (this.loaders>0){ this.loaders--; }
        if (this.loaders==0){
          if (this.delayLoader!=null){
              clearTimeout(this.delayLoader);
              this.delayLoader=null;
          }
          this.setState({loading : false});
        }
    }
    
    render(){
        if (this.state.loading==true) {
            return(
                <div id="loader">
                    <div className="sk-circle">
                        <div className="sk-circle1 sk-child"></div>
                        <div className="sk-circle2 sk-child"></div>
                        <div className="sk-circle3 sk-child"></div>
                        <div className="sk-circle4 sk-child"></div>
                        <div className="sk-circle5 sk-child"></div>
                        <div className="sk-circle6 sk-child"></div>
                        <div className="sk-circle7 sk-child"></div>
                        <div className="sk-circle8 sk-child"></div>
                        <div className="sk-circle9 sk-child"></div>
                        <div className="sk-circle10 sk-child"></div>
                        <div className="sk-circle11 sk-child"></div>
                        <div className="sk-circle12 sk-child"></div>
                    </div>
                </div>
            )
        }else{
            return null
        }
    }
}

class ModalWin extends React.Component{
    constructor(props){
      super(props);
      global.modal=this;
      this.state={modal:false};
      this.state.title='';
      this.state.content='';
    }
    componentWillReceiveProps(someProps) {
      this.setState({});
    }    
  showModal(title, content){
      if (this.state.modal==false){
        this.title=title;
        this.content=content;
        this.setState({modal : true, title: title, content: content});
      }
  }

  hideModal(){
      if (this.state.modal==true){
        this.setState({modal : false});
      }
  }

    render(){
        if (this.state.modal==true) {
            return(
                <div className="modal" role="dialog">
                    <div className="modal-dialog" role="document">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title">{ this.state.title }</h5>
                          <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div className="modal-body">
                          <p>{ this.state.content }</p>
                        </div>
                        <div className="modal-footer">
                          <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={ this.hideModal.bind(this) }>Close</button>
                        </div>
                      </div>
                    </div>
                  </div>
            )
        }else{
            return null
        }
    }
}