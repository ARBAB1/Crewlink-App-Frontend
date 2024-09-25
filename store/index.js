import { combineReducers, compose, createStore, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";
import RegisterUserReducer from "./reducers/UserRegister/index";
import OtpVerificationReducer from "./reducers/OptVerification";
import LoginReducer from "./reducers/UserLogin";
import ForgotPasswordReducer from "./reducers/ForgotPassword";
import { CheckInReducer, CityReducer, CountryReducer, StatesReducer } from "./reducers/Country";
import ReApplyDocReducer from "./reducers/ReApplyDoc";
import { AllEventReducer, JoinedEventReducer, MyEventReducer } from "./reducers/Events";
import { GetUserProfileReducer } from "./reducers/UserProfile";
import AuthReducerGlobal from "./reducers/Auth";
import PostCreationReducer from "./reducers/PostCreation";
import { AllConnectionsReducer, PendingConnectionsReducer } from "./reducers/Connections";
import NotificationReducer from "./reducers/Notification";


const reducers = combineReducers({
  RegisterUserReducer,
  OtpVerificationReducer,
  LoginReducer,
  CountryReducer,
  StatesReducer,
  CityReducer,
  CheckInReducer,
  ForgotPasswordReducer,
  ReApplyDocReducer,
  AllEventReducer,
  JoinedEventReducer,
  MyEventReducer,
  GetUserProfileReducer,
  AuthReducerGlobal,
  PostCreationReducer,
  AllConnectionsReducer,
  PendingConnectionsReducer,
  NotificationReducer
});

const composeEnhancers = window.REDUX_DEVTOOLS_EXTENSION_COMPOSE || compose;
const store = createStore(reducers, {}, composeEnhancers(applyMiddleware(thunk)));
export default store;

