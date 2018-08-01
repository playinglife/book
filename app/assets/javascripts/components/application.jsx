var APIUrls={}

var global={
    app: null   /*Will be set in application didMount event*/
}

//const authenticityToken={ authenticityToken };

class Application extends React.Component {
  /*Constructor*/
  constructor(props){
    super(props);
    this.state={};
    this.state.data=this.props.data;
    this.state.component=this.props.component!==undefined?this.props.component:null;
    
    this.firstRun=true;

    global.app=this;
        
    this.changeComponent.bind(this);
    this.loadComponent.bind(this);
    this.notify.bind(this);
  }
  
  /*Life cycles*/
  componentDidCatch(error, info){
  }

  componentDidMount() {
  }
  
  changeComponent(what,data,event){
    this.setState({component: what,data: data});
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
    if (this.firstRun){
        return ( <ComponentName data={ this.state.data } changeComponent={ this.changeComponent.bind(this) } noImage={ this.props.noImage } /> );
    }else{
        return ( <ComponentName noImage={ this.props.noImage } /> );
    }
  }

  notify(type,title,message){
    $.notify({
            icon: '',
            title: title,
            message: message,
            target: '_blank'
    },{
	element: 'body',
	position: null,
	type: type,
	allow_dismiss: true,
	newest_on_top: false,
	showProgressbar: false,
	placement: {
		from: "bottom",
		align: "center"
	},
	offset: 20,
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

  render() {
    return (
        <div id="container">
            <div>
                <ul className="sidebar-nav">
                    <li className="sidebar-brand">
                        <img src={this.props.logo} />
                        <a href='' onClick={ this.changeComponent.bind(this, 'NewBook', {}) }>
                            <i className="fa fa-plus add-new-book-button"></i>
                        </a>
                    </li>
                    <li>
                        <a href='' onClick={ this.changeComponent.bind(this, 'BookList', {}) }>My Books</a>
                    </li>
                    <li>
                    <a rel="nofollow" data-method="delete" href={this.props.signOutLink}>Sign out</a>
                    </li>
                </ul>
            </div>
            
            <div id="the-content">
                { this.state.component!==null ? this.loadComponent() : '' }
            </div>
            <Loader />
            <div className=".notifications.top-right"></div>
            <ModalWin />
        </div>
    );
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
                          <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={ this.hideModal.bind(this) }>Close</button>
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