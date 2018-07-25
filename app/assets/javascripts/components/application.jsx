var APIUrls={}

//const authenticityToken={ authenticityToken };

class Application extends React.Component {
  constructor(props){
    super(props);
    this.state={};
    this.state.loading=false;
    this.state.component=this.props.component!==undefined?this.props.component:null;
    this.loaders=0;     /*Loaders requested count*/
    this.delayLoading=null;
    
    this.changeComponent.bind(this);
    this.loadComponent.bind(this);
    this.showLoader.bind(this);
    this.hideLoader.bind(this);
  }
  
  componentDidCatch(error, info){
  }

  componentDidMount() {
    global.loader=this;
  }
  
  changeComponent(what,event){
    this.setState({component: what});
    event.preventDefault();
  }    
  
  /*shouldComponentUpdate(nextProps){
      if (this.props.component!=nextProps.component){
          return true
      }else{
          return false;
      }
  }*/

  loadComponent(){
    var ComponentName=eval(this.state.component);
    return ( <ComponentName data={ this.props.data } noImage={ this.props.noImage } /> );
  }

  showLoader(event){
      this.loaders++;
      if (this.state.loading==false){
        this.delayLoader=setTimeout(function(){ this.setState({loading : true}); },1000);
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

  render() {
    return (
        <div id="container">
            <div>
                <ul className="sidebar-nav">
                    <li className="sidebar-brand">
                        <img src={this.props.logo} />
                        <a href='' onClick={ this.changeComponent.bind(this, 'NewBook') }>
                            <i className="fa fa-plus add-new-book-button"></i>
                        </a>
                    </li>
                    <li>
                        <a href='' onClick={ this.changeComponent.bind(this, 'BookList') }>Book List</a>
                    </li>
                    <li>
                    <a rel="nofollow" data-method="delete" href={this.props.signOutLink}>Sign out</a>
                    </li>
                </ul>
            </div>
            
            <div id="the-content">
                { this.state.component!==null ? this.loadComponent(this.state.component) : '' }
            </div>
            <Loader show={ this.state.loading } />
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


class BookList extends React.Component {

  constructor(props){
    super(props);
    this.state={'books':this.props.data};
    this.url=APIUrls['BookList'];
  }

  componentDidMount() {
  }

  shouldComponentUpdate(nextProps, nextState){
      if (this.state.books!=nextProps.data){
          return true
      }else{
          return false;
      }
  }

  render() {
      return (
        <div id='books'>
            { this.state.books.map(function(book, index){ return <Book key={ index } title={book.title} image={book['image']} description={book.description} noImage={this.props.noImage}/>}.bind(this)) }
        </div>
    )
  }
}





class Information extends React.Component{
    constructor(props){
        super(props);
    }
    
    render(){
        return(
                <div>This is super cool!</div>
        );
    }
}