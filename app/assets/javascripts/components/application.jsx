class Application extends React.Component {
  constructor(props){
    super(props);
  }
  
  componentDidCatch(error, info){
  }
  
  render() {
    return (
    <div id="container">

        <div>
            <ul className="sidebar-nav">
                <li className="sidebar-brand">
                    <a href="#">
                        <img src={this.props.logo} />
                    </a>
                </li>
                <li>
                    <a href="#">Book List</a>
                </li>
                <li>
                <a rel="nofollow" data-method="delete" href={this.props.signOutLink}>Sign out</a>
                </li>
            </ul>
        </div>

        <div className="container-fluid">
            <div id='books'>
                { this.props.books.map(function(book){ return <Book title={book.title} image={book['image']} description={book.description} noImage={this.props.noImage}/>}.bind(this)) }
            </div>
        </div>
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
        </div>
    )
  }
}


    