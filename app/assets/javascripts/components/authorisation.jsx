class Authorize extends React.Component{
   constructor(props){
    super(props);

    this.state={
      view: this.props.unlockToken!=null ? 'Unlock' : this.props.resetPasswordToken!=null ? 'Reset' : 'Login'
    }
    
  }
      
  switchTo(event,what){
    if (event){
      event.preventDefault();
    }
    this.setState({view: what});
  }  
  
  login(){
    this.setState({view: 'Login'});
    this.props.onLogin();
  }
  
  loadComponent(){
    var ComponentName=eval(this.state.view);
    return ( <ComponentName onLogin={ this.login.bind(this) } switchTo={ this.switchTo.bind(this) } resetPasswordToken={ this.props.resetPasswordToken } unlockToken={ this.props.unlockToken } /> );
  }
  
  render(){
    return(
     this.loadComponent() 
    )
  }
}

/*Login*/
class Login extends React.Component{
   constructor(props){
    super(props);
    
    this.state={
      email: '',
      password: '',
      remember: 0,
    }
  }

  changeEmail(event){
    this.setState({ email: event.target.value });
  }
  changePassword(event){
    this.setState({ password: event.target.value });
  }
  changeRemember(event){
    this.setState({ remember: event.target.value });
  }
  login(){
    var self=this;
    var data={
      user:{
        email: this.state.email,
        password: this.state.password,
        remember_me: this.state.remember,
      }
    };
    
    global.fetch(APIUrls['Login'], 'POST', data, {
      callbackSuccess:function(response){
      },
      callbackFailure:function(response){
        if (response.error){
          global.app.notify('danger','',response.error);
        }else{
          global.csrf=headers.get('Toki')
          self.props.onLogin();
        }
      },
      callbackError:function(){
      }
    });
  }
  
  render(){
    return(
      <div id="center-devise">
        <h2>Log in</h2>
        <form className="new_user" acceptCharset="UTF-8">
          <input name="utf8" value="✓" type="hidden" />
          <div className="field">
            <label>Email</label><br/>
            <input autoFocus="autofocus" autoComplete="email" className="form-control" value={ this.state.email } type="email" onChange={ this.changeEmail.bind(this) }/>
          </div>
          <div className="field">
            <label>Password</label><br/>
            <input autoComplete="off" className="form-control" type="password" value={ this.state.password } onChange={ this.changePassword.bind(this) } />
          </div>
          <br/>
          <div className="field form-group form-check">
            <input className="form-check-input" value={ this.state.remember } type="checkbox" onChange={ this.changeRemember.bind(this) }/>
            <label htmlFor="user_remember_me">Remember me</label>
          </div>
          <hr/>
          <div className="actions">
            <input value="Log in" className="btn btn-primary" type="button" onClick={ this.login.bind(this) }/>
          </div>
        </form>
          <a href="" onClick={ (event) => this.props.switchTo(event,'Signup') }>Sign up</a><br/>
          <a href="" onClick={ (event) => this.props.switchTo(event,'Forgot') }>Forgot your password?</a><br/>
          <a href="" onClick={ (event) => this.props.switchTo(event,'Unlock') }>Didn't receive unlock instructions?</a><br/>
      </div>
    )
  }
}



/*Signup*/
class Signup extends React.Component{
   constructor(props){
    super(props);
    
    this.state={
      email: '',
      password: '',
      passwordConfirm: '',
    }
  }

  changeEmail(event){
    this.setState({ email: event.target.value });
  }
  changePassword(event){
    this.setState({ password: event.target.value });
  }
  changePasswordConfirm(event){
    this.setState({ passwordConfirm: event.target.value });
  }
  signup(){
    var self=this;
    var data={
      user:{
        email: this.state.email,
        password: this.state.password,
        password_confirmation: this.state.passwordConfirm,
      }
    };
    
    global.fetch(APIUrls['Signup'], 'POST', data, {
      callbackSuccess:function(response){},
      callbackFailure:function(response){
        if (response.errors){
          for(var key in response.errors){
            global.app.notify('danger','',key+' '+response.errors[key]);
          }
        }else{
          self.props.onLogin();          
        }
      },
      callbackError:function(response){}
    });
  }
  
  render(){
    return(
      <div id="center-devise">
        <h2>Sign up</h2>
        <form className="new_user" acceptCharset="UTF-8">
          <div className="field">
            <label>Email</label><br/>
            <input autoFocus="autofocus" autoComplete="email" className="form-control" value={ this.state.email } type="email" onChange={ this.changeEmail.bind(this) }/>              
          </div>

          <div className="field">
            <label>Password</label>
            <br/>
            <input autoComplete="off" className="form-control" type="password" value={ this.state.password } onChange={ this.changePassword.bind(this) } />
          </div>

          <div className="field">
            <label>Password confirmation</label><br/>
            <input autoComplete="off" className="form-control" type="password" value={ this.state.passwordConfirm } onChange={ this.changePasswordConfirm.bind(this) } />
          </div>

          <hr/>

          <div className="actions">
            <input value="Sign up" className="btn btn-primary" type="button" onClick={ this.signup.bind(this) }/>
          </div>
        </form>
          <a href="" onClick={ (event) => this.props.switchTo(event,'Login') }>Login</a><br/>
          <a href="" onClick={ (event) => this.props.switchTo(event,'Forgot') }>Forgot your password?</a><br/>
          <a href="" onClick={ (event) => this.props.switchTo(event,'Unlock') }>Didn't receive unlock instructions?</a><br/>
      </div>              
    )
  }
}



/*Forgot*/
class Forgot extends React.Component{
   constructor(props){
    super(props);
    
    this.state={
      email: ''
    }
  }

  changeEmail(event){
    this.setState({ email: event.target.value });
  }
  forgot(){
    var self=this;
    var data={
      user:{
        email: this.state.email
      }
    };
    
    global.fetch(APIUrls['Forgot'], 'POST', data, {
      callbackSuccess:function(response){},
      callbackFailure:function(response){
        if (response.errors){
          for(var key in response.errors){
            global.app.notify('danger','',key+' '+response.errors[key]);
          }
        }else{
          self.props.switchTo(null,'Login')
        }
      },
      callbackError:function(response){}
    });
  }
  
  render(){
    return(
      <div id="center-devise">
        <h2>Forgot your password?</h2>
        <form className="new_user" >
          <div className="field">
            <label>Email</label><br />
            <input autoFocus="autofocus" autoComplete="email" className="form-control" value={ this.state.email } type="email" onChange={ this.changeEmail.bind(this) }/>
          </div>
          <hr />
          <div className="actions">
            <input value="Send me reset password instructions" className="btn btn-primary" type="button" onClick={ this.forgot.bind(this) } />
          </div>
        </form>
        <a href="" onClick={ (event) => this.props.switchTo(event,'Login') }>Login</a><br/>
        <a href="" onClick={ (event) => this.props.switchTo(event,'Signup') }>Sign up</a><br/>
        <a href="" onClick={ (event) => this.props.switchTo(event,'Unlock') }>Didn't receive unlock instructions?</a><br/>
      </div>
    )
  }
}

/*Reset*/
class Reset extends React.Component{
   constructor(props){
    super(props);
    
    this.state={
      password: '',
      password_confirm: ''
    }
    this.resetPassword=this.resetPassword.bind(this);
  }

  changePassword(event){
    this.setState({ password: event.target.value });
  }
  changePasswordConfirm(event){
    this.setState({ password_confirm: event.target.value });
  }

  resetPassword(){
    var self=this;
    var data={
      user:{
        reset_password_token: this.props.resetPasswordToken,
        password: this.state.password,
        password_confirmation: this.state.password_confirm
      }
    };
    
    global.fetch(APIUrls['Reset'], 'PUT', data, {
      callbackSuccess:function(response){},
      callbackFailure:function(response){
        if (response.errors){
          for(var key in response.errors){
            global.app.notify('danger','',key+' '+response.errors[key]);
          }
        }else{
        }
      },
      callbackError:function(response){
        self.props.onLogin();
      }
    });
  }
  
  render(){
    return(
      <div id="center-devise">
        <h2>Change your password</h2>
        <form className="new_user">
          <div className="field">
            <label>New password</label><br />
            <input className="form-control" autoComplete="off" type="password" value={ this.state.password } onChange={ this.changePassword.bind(this) }/>
          </div>
          <div className="field">
            <label>Confirm new password</label><br />
            <input className="form-control" autoComplete="off" type="password" value={ this.state.password_confirm } onChange={ this.changePasswordConfirm.bind(this) }/>
          </div>
          <hr />
          <div className="actions">
            <input value="Change my password" className="btn btn-primary" type="button" onClick={ this.resetPassword.bind(this) } />
          </div>
        </form>
        <a href="" onClick={ (event) => this.props.switchTo(event,'Login') }>Login</a><br/>
        <a href="" onClick={ (event) => this.props.switchTo(event,'Signup') }>Sign up</a><br/>
        <a href="" onClick={ (event) => this.props.switchTo(event,'Unlock') }>Didn't receive unlock instructions?</a><br/>
      </div>
    )
  }
}

/*Unlock*/
class Unlock extends React.Component{
   constructor(props){
    super(props);
    
    this.state={
      email: ''
    }
    if (this.props.unlockToken!=null){
      this.state.message="Unlocking account ...";
    }
    this.unlock=this.unlock.bind(this);
    this.startUnlock=this.startUnlock.bind(this);
    this.changeEmail=this.changeEmail.bind(this);
  }

  componentDidMount() {
    if (this.props.unlockToken!=null){
      var self=this;
      setTimeout(function(){self.startUnlock();},3000);
    }
  }

  changeEmail(event){
    this.setState({ email: event.target.value });
  }

  unlock(){
    var self=this;
    var data={
      user:{
        email: this.state.email
      }
    };
    
    global.fetch(APIUrls['Unlock'], 'POST', data, {
      callbackSuccess:function(response){},
      callbackFailure:function(response){
        if (response.errors){
          for(var key in response.errors){
            global.app.notify('danger','',key+' '+response.errors[key]);
          }
        }else{
          global.app.notify('success','','Unlock instructions were sent to your email address');
          self.props.switchTo(null,'Login');
        }
      },
      callbackError:function(response){}
    });
  }
  
  startUnlock(){
    var self=this;
    var data={
      unlock_token: this.props.unlockToken
    };

    global.fetch(APIUrls['Unlock']+'?unlock_token='+this.props.unlockToken, 'GET', null, {
      callbackSuccess:function(response){},
      callbackFailure:function(response){
        if (response.unlock_token){
          for(var key in response){
            global.app.notify('danger','',key+' '+response[key]);
          }
          self.setState({message: ''});
        }else{
          global.app.notify('success','','Account unlocked succesfully');
          self.props.switchTo(null,'Login');
        }
      },
      callbackError:function(response){}
    });
  }
  
  render(){
    return(
      <div id="center-devise">
        <h2>{ this.state.message }</h2>
        <h2>Resend unlock instructions</h2>
        <form className="new_user">
          <div className="field">
            <label>Email</label><br />
            <input className="form-control" autoComplete="off" type="email" value={ this.state.email } onChange={ this.changeEmail } />
          </div>
          <hr />
          <div className="actions">
            <input value="Resend unlock instructions" className="btn btn-primary" type="button" onClick={ this.unlock } />
          </div>
        </form>
        <a href="" onClick={ (event) => this.props.switchTo(event,'Login') }>Login</a><br/>
        <a href="" onClick={ (event) => this.props.switchTo(event,'Signup') }>Sign up</a><br/>
        <a href="" onClick={ (event) => this.props.switchTo(event,'Forgot') }>Forgot your password?</a><br/>
      </div>
    )
  }
}