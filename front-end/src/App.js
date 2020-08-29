import React, {Component} from 'react';
import './App.css';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
import Rank from './components/Rank/Rank'
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
import SignIn from './components/SignIn/SignIn'
import Register from './components/Register/Register'


const particlesOptions = {
  particles: {
    number: {
      value: 60,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

const initialState = {
    input: '',
    boxes: [],
    route: 'signin',
    isSignedIn: false,
    user: {
      id: '',
      name: '',
      email: '',
      entries: 0,
      joined: ''
    }
}

class App extends Component{
  constructor(){
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState( {user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
    }})
  }

  calculateFaceLocation = (data) => {
    if (typeof data.outputs[0].data.regions === "undefined"){  //no face found
      return []; 
    }
    else{ //face has been found!
     const clarifaiFaces = 
        data.outputs[0].data.regions.map(region => region.region_info.bounding_box);
      const image = document.getElementById('inputimage');
      const width = Number(image.width);
      const height = Number(image.height);
      return clarifaiFaces.map(face => { 
         return{
            leftCol: face.left_col * width,
            topRow: face.top_row * height,
            rightCol: width - (face.right_col * width),
            bottomRow: height - (face.bottom_row * height)
         };
      }); 
    }
  }

  displayFaceBox = (boxes) => {    
     this.setState ({boxes: boxes});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value}); 
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    fetch('https://floating-savannah-92712.herokuapp.com/image', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        input: this.state.input
      })
    })
    .then(response => response.json())
    .then(response => {
      if (response) {
        fetch('https://floating-savannah-92712.herokuapp.com/image', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: this.state.user.id
          })
        })
        .then(response => response.json())
        .then(count => {
             this.setState(Object.assign(this.state.user, {entries: count}))
         })
        .catch(console.log)
      }
    this.displayFaceBox(this.calculateFaceLocation(response))
    })
    .catch(err => console.log(err));
  }

  onRouteChange = (newroute) => {
    if (newroute === 'signout'){
      this.setState(initialState)
      newroute = 'signin'
    } else if (newroute === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: newroute})
  }

  render(){
    const { isSignedIn, route } = this.state; /*destructuring*/
    return (
      <div className="App">
        <Particles className='particles'
            params={particlesOptions}
          />
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn} />
        { route === 'home'
          ? <div>
              <Rank name={this.state.user.name} entries={this.state.user.entries}/>
              <ImageLinkForm 
                onInputChange={this.onInputChange} 
                onButtonSubmit={this.onButtonSubmit} />
              <FaceRecognition boxes={this.state.boxes} imageUrl= {this.state.imageUrl} />
            </div>
          : ( route === 'signin' 
              ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
              : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            )
        }
      </div>
    );
  }
}

export default App;
