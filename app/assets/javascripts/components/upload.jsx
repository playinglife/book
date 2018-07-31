class FileInput extends React.Component {
  constructor(props){
    super(props);
    this.state={active: false, target: false, hover: false};
    
    this.uploadRef=React.createRef();
    
    this.getClassNames.bind(this);
    this.dropTarget.bind(this);
    this.dropLeave.bind(this);
    this.handleChange.bind(this);
  }  
  componentDidMount(){
    //window.addEventListener('dragover', this.dropTarget.bind(this));
    //window.addEventListener('dragleave', this.dropLeave.bind(this));
    //window.addEventListener('drop', this.handleDrop.bind(this));
  }
  componentWillUnmount(){
    //window.removeEventListener('dragover', this.dropTarget);
    //window.removeEventListener('dragleave', this.dropLeave);
    //window.removeEventListener('drop', this.handleDrop);
  }
  handleChange(e){
    var file = e.target.files[0];
    this.props.onFileChange({
      file: file,
      name: file.name,
      type: file.type
    });
  }
  dropTarget(e){
    if (this.state.active) {
      this.setState({
        target: true
      });
    }
  }
  dropLeave(e) {
    if(e.screenX === 0 && e.screenY === 0) { // Checks for if the leave event is when leaving the window
    	this.setState({
    	  target: false
    	});
    }
  }
  handleDrop(e){
    e.preventDefault();
    e.stopPropagation();

    var uploadObj = {
      target: e.dataTransfer
    };
    this.setState({
      target: false,
      hover: false
    });
    
    this.handleChange(uploadObj);
  }
  handleDragEnter(e) {
    e.preventDefault();
    e.stopPropagation();
    
    $(this.uploadRef.current).addClass('highlight');
    
    if (!this.state.active) {
      this.setState({
        hover: true
      });
    }
  }
  handleDragLeave(e) {
    $(this.uploadRef.current).removeClass('highlight');
		this.setState({
      hover: false
    });
  }
  handleDragOver(e){
    $(this.uploadRef.current).addClass('highlight');
    e.preventDefault();
  }
  getClassNames(){
    var classes = [];
    if(this.state.target) {
      classes.push('target');
    }
    if(this.state.hover) {
      classes.push('hover')
    }
    return classes.join(' ');
  }
  render(){
    var classNames = this.getClassNames();
    return (
      <div ref={ this.uploadRef } className= 'file-container ' onDrop={ this.handleDrop.bind(this) } onDragEnter={ this.handleDragEnter.bind(this) }
        onDragOver={ this.handleDragOver.bind(this) } onDragLeave={ this.handleDragLeave.bind(this) }>
          <div>Click or drop an image</div>
          <input className={ "file-input " + classNames } name="upload" type="file" 
            onChange={ this.handleChange.bind(this) } />
      </div>
    )
  }
}



class FilePreview extends React.Component {
  render(){
    if (this.props.existing!=null){
      return(
        <div className="file-preview">
          <img className="preview-img" src={ this.props.existing }/>
          <br/><br/>
          <button className="btn btn-primary" onClick={ this.props.handleFileRemove } name="Remove File">Remove</button>
        </div>
      )
    }else{
      return(
        <div className="file-preview">
          { this.props.type.indexOf("image") > -1 ? <img className="preview-img" src={ this.props.file }/> : null }
          /*{ this.props.type.indexOf("image") != -1 ? <p className="preview-name">{ this.props.name }</p> : null }*/
          <br/><br/>
          <button className="btn btn-primary" onClick={ this.props.handleFileRemove } name="Remove File">Remove</button>
        </div>
      )
    }
  }
}