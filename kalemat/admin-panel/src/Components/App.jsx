// Import modules
import React, { Component, Fragment } from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import styled, { injectGlobal } from 'styled-components'
import { ToastContainer, toast } from 'react-toastify'
import { auth } from 'firebase/app'
import 'firebase/auth'

import { base } from './ReBase'

// Import pages
import LoginPage from './Pages/LoginPage'
import { AdminContainer } from './AdminContainer'

// Import Fontawesome icons
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUsers, faBook, faEye, faThumbsUp, faThumbsDown, faSearch, faMusic, faEllipsisV, faPlus, faExclamationCircle, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'

// Import css
import './Style.css'
import 'react-toastify/dist/ReactToastify.css';

// Import statics
import triangle from '../assets/svg/ball-triangle.svg'

library.add(faUsers, faBook, faEye, faThumbsUp, faThumbsDown, faSearch, faMusic, faEllipsisV, faPlus, faExclamationCircle, faSignOutAlt)


const PrivateRoute = ({ component: Component, ...rest }) =>
  <Route {...rest} render={props =>
    rest.user ? (
      <Component {...props} {...rest} />
    ) : (
        <Redirect to="/login" />
      )
  } />

const PublicRoute = ({ component: Component, ...rest }) =>
  <Route {...rest} render={props =>
    rest.user ? (
      <Redirect to="/" />
    ) : (
        <Component {...props} {...rest} />
      )
  } />

export default class App extends Component {
  state = {
    user: null,
    loading: true
  }

  onAuthStateChanged = null

  handleLogout = () => {
    auth().signOut()
      .catch(e => {
        toast.error(e.message)
      })
  }

  componentWillMount = () => {
    this.onAuthStateChanged = auth().onAuthStateChanged(user => {
      if (user) {
        base.fetch('users', {
          asArray: true,
          queries: {
            orderByChild: 'email',
            equalTo: user.email
          }
        })
          .then(result => {
            if (result.length > 0 && result[0].isAdmin) {
              this.setState({ user, loading: false })
            } else {
              this.setState({ user: null, loading: false }, () => {
                auth().signOut()
                toast.error('This account has not perrmission to access admin panel!')
              })
            }
          })
      } else {
        this.setState({ user, loading: false })
      }
    })
  }

  componentWillUnmount = () => {
    this.onAuthStateChanged = null
  }

  render = () => {
    if (this.state.loading)
      return <Loading>
        <img src={triangle} alt=""/>
        <h2>Loading...</h2>
      </Loading>

    return <Fragment>
      <BrowserRouter>
        <Switch>
          <PublicRoute
            user={this.state.user}
            exact
            path="/login"
            component={LoginPage}
          />
          <PrivateRoute
            user={this.state.user}
            logoutHandler={this.handleLogout}
            path="/"
            component={AdminContainer}
          />
        </Switch>
      </BrowserRouter>

      <ToastContainer
        position={toast.POSITION.BOTTOM_RIGHT}
        autoClose={6000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnVisibilityChange
        draggable
        pauseOnHover
        draggablePercent={100}
      />
    </Fragment>
  }
}

const
  Loading = styled.div`
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    
    h2 {
      margin-top: 60px;
      font-weight: 300;
      color: #333;
    }
  `

injectGlobal`
  * {
    font-family: 'Roboto', sans-serif;
    margin: 0;
    padding: 0;
  }

  body {
    background: #FAFAFA;
  }

  a {
    text-decoration: none;
    color: inherit;
  }
`