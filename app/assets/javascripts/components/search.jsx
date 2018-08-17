class Search extends React.Component{
  constructor(props){
    super(props);
  
    this.rootRef=React.createRef();
  
    this.filter=this.filter.bind(this);
    this.clear=this.clear.bind(this);
    this.hide=this.hide.bind(this);
    this.show=this.show.bind(this);
  }
  
  componentDidMount(){
    $(this.rootRef.current).find('[data-toggle=tooltip]').tooltip({ boundary: 'window' });
  }
  
  filter(){
    this.props.onFilter($(this.rootRef.current).find('input').val());
  }
  clear(){
    this.props.onFilter($(this.rootRef.current).find('input').val(''));
    this.props.onFilter('');
  }
  hide(){
    this.props.onFilter($(this.rootRef.current).find('input').val(''));
    this.props.onFilter('');
    this.props.toggleFilter(false);
  }
  show(){
    this.props.toggleFilter(true);
  }
  
  render() {
    return (
      <div>
        <div className={ this.props.showFilter==true ? "panel search-box" : "panel search-box search-box-hidden" } ref={ this.rootRef }>
          <div className="input-group mb-3">
            <div className={ this.props.filter==null || this.props.filter=='' ? "input-group-prepend hidden" : "input-group-prepend" }>
            <span className="input-group-text user-alert">
              <i className="fa fa-filter" data-toggle="tooltip" title="The results you are seeing are filtered"></i>
            </span>
            </div>
            <input type="text" className="form-control" aria-label="Amount (to the nearest dollar)" />
            <div className="input-group-append">
            <span className="input-group-text">
              <i className="fa fa-close" data-toggle="tooltip" title="Clear filter" onClick={ this.clear }></i>
            </span>
            </div>
            <div className="input-group-prepend">
              <button className="btn btn-primary" type="button" onClick={ this.filter }>Filter</button>
            </div>          
            <div className="input-group-prepend">
              <span className="input-group-text">
                <i className="fa fa-arrow-up" onClick={ this.hide } data-toggle="tooltip" title="Hide filter"></i>
              </span>
            </div>
          </div>
        </div>
        <div className={ this.props.showFilter==false ? "panel search-box search-box-show" : "panel search-box search-box-hidden search-box-show" }>
          <div className="input-group mb-3">
            <div className="input-group-prepend">
            <span className="input-group-text">
              <i className="fa fa-arrow-down" onClick={ this.show } data-toggle="tooltip" title="Show filter"></i>
            </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
}
