import { observer } from 'mobx-react';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import AccountActivation from './components/AccountActivation';
import Admin from './components/Admin';
import ChatPage from './components/ChatPage';
import ContactEmployee from './components/ContactEmployee';
import ErrorPages from './components/ErrorPages';
import ForgotPassword from './components/ForgotPassword';
import ListWorkers from './components/ListWorkers';
import Login from './components/Login';
import LoginSuperAdmin from './components/LoginSuperAdmin';
import Logout from './components/Logout';
import NUserProfile from './components/NUserProfile';
import PrivateRoute from './components/PrivateRoute';
import ResetPassword from './components/ResetPassword';
import SignUp from './components/SignUp';
import WorkerProfile from './components/WorkerProfile';
import { roles } from './config.json';
import Home from './pages';

function App() {
  const { ADMIN, NEIGHBOUR, SUPER_ADMIN } = roles;
  return (
    <div id="appFile" className="outer-line">
      <div id="try" className="inner-line">
        <Router id="router">
          <Switch id="switch">
            <Route id="route" exact path="/" component={Home} />
            <PrivateRoute
              exact
              path="/superAdmin"
              component={Admin}
              roles={[SUPER_ADMIN.u_name]}
            />
            <Route path="/signup" component={SignUp} />
            <Route exact path="/login" component={Login} />
            <Route path="/logout" component={Logout} />
            <Route path="/superAdmin/login" component={LoginSuperAdmin} />
            <Route path="/auth/activate/:token" component={AccountActivation} />
            <Route path="/resetPassword/:token" component={ResetPassword} />
            <Route path="/forgotPassword" component={ForgotPassword} />
            <Route path="/services/category/:id" component={ListWorkers} />
            <Route path="/search/:wildcard" component={ListWorkers} />
            <PrivateRoute
              path="/employee/:id/contact"
              component={ContactEmployee}
              roles={[NEIGHBOUR.u_name]}
            />
            <Route path="/profile/:id" component={WorkerProfile} />
            <Route path="/chat" component={ChatPage} />
            <PrivateRoute
              path="/myProfile"
              component={NUserProfile}
              roles={[ADMIN.u_name, NEIGHBOUR.u_name]}
            />
            <Route path="*" component={ErrorPages} />
          </Switch>
        </Router>
      </div>
    </div>
  );
}

export default observer(App);
