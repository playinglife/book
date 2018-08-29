class Search extends React.Component{
  constructor(props){
    super(props);
  
    this.state={
      option: 'All',
      query: this.props.filter && this.props.filter.query ? this.props.filter.query : null
    }
    
    this.filterApplied=false;
    
    this.rootRef=React.createRef();
  
    this.filter=this.filter.bind(this);
    this.clear=this.clear.bind(this);
    this.hide=this.hide.bind(this);
    this.show=this.show.bind(this);
    this.select=this.select.bind(this);
  }
  
  componentDidMount(){
    $(this.rootRef.current).find('[data-toggle=tooltip]').tooltip({ boundary: 'window' });
  }
  
  componentWillReceiveProps(newProps){
      if (newProps.filter!=null){
        var newState={
          query: this.state.query,
          option: this.state.option
        }
        if (typeof newProps.filter.query!='undefined' && this.state.query!=newProps.filter.query){
          newState.query=newProps.filter.query;
        }
        if (typeof newProps.filter.option!='undefined' && this.state.option!=newProps.filter.option){
          newState.option=newProps.filter.option;
        }
        this.setState(newState);
        ((newState.query==null || newState.query=='') && newState.option=='All') ? this.filterApplied=false : this.filterApplied=true;      
      }
  }
  
  filter(){
    this.props.onFilter({query: $(this.rootRef.current).find('input').val(), option: this.state.option});
  }
  clear(){
    $(this.rootRef.current).find('input').val('');
    this.props.onFilter({query: '', option: this.state.option });
    //this.props.onFilter('');
  }
  hide(){
    $(this.rootRef.current).find('input').val('');
    this.setState({option: 'All'});
    //this.props.onFilter({query: $(this.rootRef.current).find('input').val(''), option: 'All' });
    //this.props.onFilter('');
    this.props.toggleFilter(false);
  }
  show(){
    this.props.toggleFilter(true);
  }
  select(event){
    this.setState({option: $(event.target).attr('data-option')});
  }
    
  render() {
    return (
      <div>
        <div className={ this.props.showFilter==true ? "panel search-box" : "panel search-box search-box-hidden" } ref={ this.rootRef }>
          <div className="input-group mb-3">
            <div className={ this.filterApplied==true ? "input-group-prepend" : "input-group-prepend hidden" }>
            <span className="input-group-text user-alert">
              <i className="fa fa-filter" data-toggle="tooltip" title="The results you are seeing are filtered"></i>
            </span>
            </div>
            <input type="text" className="form-control" onKeyDown={ this.filterChanged } />
            <div className="input-group-append">
            <span className="input-group-text">
              <i className="fa fa-close" data-toggle="tooltip" title="Clear filter" onClick={ this.clear }></i>
            </span>
            </div>
            <div className="input-group-prepend">
              <button className="btn btn-primary" type="button" onClick={ this.filter }>Filter</button>
            </div>          
            <div className="input-group-prepend" onClick={ this.hide }>
              <span className="input-group-text">
                <i className="fa fa-arrow-up" data-toggle="tooltip" title="Hide filter"></i>
              </span>
            </div>
          </div>
          
          <div className="btn-group options" role="group" data-toggle="buttons">
            <button data-option="All" type="button" className={ "btn btn-secondary col-sm-4 "+(this.state.option=='All' ? 'active' : '') } onClick={ this.select }>All</button>
            <button data-option="GivenTaken" type="button" className={ "btn btn-secondary col-sm-4 "+(this.state.option=='GivenTaken' ? 'active' : '') } onClick={ this.select }>{ this.props.mine==true ? 'Lended' : 'Borrowed' }</button>
            <button data-option="NotGivenTaken" type="button" className={ "btn btn-secondary col-sm-4 "+(this.state.option=='NotGivenTaken' ? 'active' : '') } onClick={ this.select }>{ this.props.mine==true ? 'Not Lended' : 'Not Borrowed' }</button>
          </div>

        </div>
        <div className={ this.props.showFilter==false ? "panel search-box search-box-show" : "panel search-box search-box-hidden search-box-show" }>
          <div className="input-group mb-3">
            <div className="input-group-prepend" onClick={ this.show }>
              <span className="input-group-text">
                <i className="fa fa-arrow-down" data-toggle="tooltip" title="Show filter"></i>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
}
