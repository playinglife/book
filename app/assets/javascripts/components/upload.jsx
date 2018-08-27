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
    var files=[];
    for (var i=0;i<e.target.files.length;i++){
      files.push({
        file: e.target.files[i],
        name: e.target.files[i].name,
        type: e.target.files[i].type
      });
    }
    
    this.props.onFileChange(files);
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
    $(this.uploadRef.current).removeClass('highlight');
    
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
          <h3>Click or drop an image</h3>
          <input className={ "file-input " + classNames } name="upload" type="file" onChange={ this.handleChange.bind(this) } />
      </div>
    )
  }
}



class FilePreview extends React.Component {
  render(){
    if (this.props.existing!=null){
      return(
        <div className="file-preview">
          <img className="preview-img" src={ this.props.existing+"?sync="+Date.now() }/>
          <br/><br/>
          { this.props.onlyView!=true ? <button className="btn btn-primary" onClick={ this.props.handleFileRemove } name="Remove File">Remove</button> : '' }
        </div>
      )
    }else{
      return(
        <div className="file-preview">
          { this.props.type.indexOf("image") > -1 ? <img className="preview-img" src={ this.props.file }/> : null }
          { this.props.type.indexOf("image") != -1 ? <p className="preview-name">{ this.props.name }</p> : null }
          <br/><br/>
          <button className="btn btn-primary" onClick={ this.props.handleFileRemove } name="Remove File">Remove</button>
        </div>
      )
    }
  }
}
/*{ this.props.type.indexOf("image") != -1 ? <p className="preview-name">{ this.props.name }</p> : null }*/



class ImageGallery extends React.Component {
  constructor(props){
    super(props);
    
    this.deleteImage=this.deleteImage.bind(this);
    this.setToCover=this.setToCover.bind(this);
  } 
  
  componentWillReceiveProps(someProps) {
    
  }
  
  componentDidMount(){
  }
  componentWillUnmount(){
  }
  
  deleteImage(id){
    if (typeof this.props.deleteImage=='function'){
      this.props.deleteImage(id);
    }
  }

  setToCover(id){
    //this.setState({cover: id});
    if (typeof this.props.setToCover=='function'){
      this.props.setToCover(id);
    }
  }
  
  render(){
    if (this.props.images.length>0){
      return(
          <div>
              { this.props.images.map(
                function(image, index){ 
                  return <Image key={ image.id } id={ image.id } url={image.name.thumb.url} cover={ image.id==this.props.cover } mine={ this.props.mine } noImage={this.props.noImage} setToCover={ this.setToCover } deleteImage={ this.deleteImage } />
                }.bind(this))
              }
          </div>
      )
    }else{
      return null;
    }
  }
}

class Image extends React.Component {
  constructor(props){
    super(props);
    
    this.rootRef = React.createRef();
    
    this.setToCover=this.setToCover.bind(this);
    this.deleteImage=this.deleteImage.bind(this);
    this.chooseClasses=this.chooseClasses.bind(this);    
  }  
  
  deleteImage(event){
    event.preventDefault();
    event.stopPropagation();
    this.props.deleteImage(this.props.id);
  }
  
  setToCover(){
    if (this.props.cover==false){
      this.props.setToCover(this.props.id);
    }else{
      this.props.setToCover(null);
    }
  }
  
  componentDidMount(){
    $(this.rootRef.current).find('[data-toggle=confirmation]').confirmation({
        rootSelector: '[data-toggle=confirmation]',
        popout: true,
        singleton: true
    });
    $(this.rootRef.current).find('[data-toggle=tooltip]').tooltip({ boundary: 'window' });    
  }

  chooseClasses(){
    var classes='';
    classes+=this.props.cover ? "thumbnail cover" : "thumbnail";
    classes+=this.props.mine ? " can-cover" : "";
    return classes;
  }
    
  render(){
    return(
        <div  ref={ this.rootRef } className={ this.chooseClasses() } onClick={ this.setToCover } >
          <img src={this.props.url} />
          { this.props.mine==true ?
          <button type="button" className="btn btn-danger w-30 card-action-delete pull-right" onClick={ this.deleteImage } data-toggle="confirmation" data-btn-ok-class="btn-success" data-btn-ok-icon-class="fa fa-check" data-btn-cancel-class="btn-danger" data-btn-cancel-icon-class="material-icons" data-title="Are you sure?">
            <i className="fa fa-remove"></i>
          </button>
          : null }
        </div>
    )
  }
}