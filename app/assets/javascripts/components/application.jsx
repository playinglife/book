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
    this.state.loading=false;
    this.state.component=this.props.component!==undefined?this.props.component:null;
    this.loaders=0;     /*Loaders requested count*/
    this.delayLoading=null;
    
    this.firstRun=true;

    global.app=this;

    this.state.modal=false;
    this.state.modalTitle='';
    this.state.modalContent='';
        
    this.changeComponent.bind(this);
    this.loadComponent.bind(this);
    this.showLoader.bind(this);
    this.hideLoader.bind(this);
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

  showModal(title, content){
      if (this.state.modal==false){
        this.title=title;
        this.content=content;
        this.setState({modal : true, modalTitle: title, modalContent: content});
      }
  }

  hideModal(){
      if (this.state.modal==true){
        this.setState({modal : false});
      }
  }

  notify(type,title,message){
    $.notify({
            icon: 'fa fa-user',
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
		from: "top",
		align: "right"
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
            <Loader show={ this.state.loading } />
            <div className=".notifications.top-right"></div>
            <ModalWin show={ this.state.modal } title={ this.state.modalTitle } content={ this.state.modalContent } hideModal={ this.hideModal.bind(this) } />
        </div>
    );
  }
}

class Loader extends React.Component{
    componentWillReceiveProps(someProps) {
      this.setState({});
    }    
    render(){
        if (this.props.show==true) {
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
    componentWillReceiveProps(someProps) {
      this.setState({});
    }    

    render(){
        if (this.props.show==true) {
            return(
                <div className="modal" role="dialog">
                    <div className="modal-dialog" role="document">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title">{ this.props.title }</h5>
                          <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div className="modal-body">
                          <p>{ this.props.content }</p>
                        </div>
                        <div className="modal-footer">
                          <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={ this.props.hideModal }>Close</button>
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