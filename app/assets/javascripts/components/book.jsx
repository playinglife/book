APIUrls['CreateBook']=window.location.href+'books';

var global={};


class NewBook extends React.Component{
    constructor(props){
        super(props);
        this.url=APIUrls['CreateBook'];
        this.rootRef = React.createRef();
    }
    
    saveBook(){
        var data={};
        var root=$(this.rootRef.current);
        data.title=root.find('#title').val();
        data.description=root.find('#description').val();
        global.loader.showLoader();
        fetch(this.url, {
          cache: 'reload',
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        }).then(function(){ global.loader.hideLoader(); });
    }
    
    render(){
        return(
            <div className="center-form" ref={ this.rootRef }>
            <h2>Add new book</h2>
            <form>
                <div className="field">
                    <label htmlFor="title">Title</label><br/>
                    <input className="form-control" id="title" type="text"/>
                </div>

                <div className="field">
                    <label htmlFor="user_email">Description</label><br/>
                    <textarea className="form-control" id="description">
                    </textarea>
                </div>
                <hr/>
                <div className="actions">
                    <input value="Save" className="btn btn-primary" type="button" onClick={ this.saveBook.bind(this) }/>
                </div>
            </form>
            </div>
        );
    }    
}

class Book extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
        <div className="card">
          <img className="card-img-top" src={this.props.image===null ? this.props.noImage : this.props.image} />
          <div className="card-body">
            <div className="card-title">{ this.props.title }</div>
            <div className="card-text">{ this.props.description }</div>
          </div>
          <div className="btn-group card-action d-flex" role="group">
            <button type="button" className="btn btn-success w-30">
              <i className="fa fa-edit"></i>
            </button>
            <button type="button" className="btn btn-primary w-100">
              Details
            </button>
            <button type="button" className="btn btn-danger w-30">
              <i className="fa fa-remove"></i>
            </button>
          </div>
        </div>
    )
  }
}
