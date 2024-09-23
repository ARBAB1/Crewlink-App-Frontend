import { StyleSheet, Image, View, Dimensions, TouchableOpacity } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddEvent from '../pages/AddEvent'
import EventScreen from '../pages/EventScreen'
import ProfileScreen from '../pages/ProfileScreen';
import UpdateEvent from '../pages/UpdateEvent';
import EditProfile from '../pages/EditProfile';
import EventDetailScreen from '../pages/EventDetailScreen';
import Setting from '../pages/Setting';
import ChangePassword from '../pages/changePassword';
import ChangeAirline from '../pages/ChangeAirline';
import DeleteAccount from '../pages/DeleteAccount';
import HomeScreen from '../pages/HomeScreen';
import ReelScreen from '../pages/Announcement.jsx';
import CreatePost from '../pages/CreatePost';
import CreatePostTwo from '../pages/CreatePostStepTwo';
import TagPeople from '../pages/PostTagPeople';
import PostSetting from '../pages/PostSetting';
import PostDetail from '../pages/PostDetail';
import MyPost from '../pages/myPost';
import Connections from '../pages/Connections';
import Notification from '../pages/Notification.jsx';
import UserProfileScreen from '../pages/UserProfileScreen';
import InAppCheckIn from '../pages/InAppCheckin';
import MessageList from '../pages/messageList';
import Message from '../pages/message';
import NewMessage from '../pages/newMessage.jsx';
import SearchUser from '../pages/SearchUser.jsx';
import NewGroupScreen from '../pages/newGroup.jsx';
import NewGroupSecondScreen from '../pages/newGroupSecond.jsx';
import GroupMessage from '../pages/groupChat.jsx';
import MessageMedia from '../pages/messageMedia.jsx';
import Announcement from '../pages/Announcement.jsx';
import CreateAnnouncement from '../pages/CreateAnnouncement.jsx';
import AnnouncementDetail from '../pages/AnnouncementDetail.jsx';
import ChatMediaDetail from '../pages/mediaDetail.jsx';
import GroupmessageMedia from '../pages/GroupmessageMedia.jsx';
import PrivacySetting from '../pages/PrivacySetting.jsx';
import CreateStatus from '../pages/CreateStatus.jsx';



const EventStackNavigation = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator initialRouteName={"EventScreen"}>
      <Stack.Screen options={{
        headerShown: false,
        navigationBarHidden: true,
      }} name="EventScreen" initialParams={{ Tab: 1 }} component={EventScreen} />
      <Stack.Screen options={{ headerShown: false, navigationBarHidden: true }} name="AddEvent" component={AddEvent} />
      <Stack.Screen options={{ headerShown: false, navigationBarHidden: true }} name="EventDetail" component={EventDetailScreen} />
      <Stack.Screen options={{ headerShown: false, navigationBarHidden: true }} name="UpdateEvent" component={UpdateEvent} />
    </Stack.Navigator>
  )
}


const ProfileStackNavigation = ({ onLogin }) => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator initialRouteName='ProfileMain'>
      <Stack.Screen options={{ headerShown: false, navigationBarHidden: true }} name="ProfileMain" component={ProfileScreen} />
      <Stack.Screen options={{ headerShown: false, navigationBarHidden: true }} name="EditProfile" component={EditProfile} />
      <Stack.Screen
        options={{ headerShown: false, navigationBarHidden: true }}
        name="Setting"
        component={(props) => <Setting {...props} onLogin={onLogin} />}
      />
      <Stack.Screen options={{ headerShown: false, navigationBarHidden: true }} name="ChangePassword" component={ChangePassword} />
      <Stack.Screen options={{ headerShown: false, navigationBarHidden: true }} name="ChangeAirline" component={ChangeAirline} />
      <Stack.Screen options={{ headerShown: false, navigationBarHidden: true }} name="MyPost" component={MyPost} />
      <Stack.Screen options={{ headerShown: false, navigationBarHidden: true }} name="Connection" component={Connections} />
      <Stack.Screen options={{ headerShown: false, navigationBarHidden: true }} name="SearchUser" component={SearchUser} />
      <Stack.Screen options={{ headerShown: false, navigationBarHidden: true }} name="UserProfileScreen" component={UserProfileScreen} />
      <Stack.Screen
        options={{ headerShown: false, navigationBarHidden: true }}
        name="DeleteAccount"
        component={(props) => <DeleteAccount {...props} onLogin={onLogin} />}
      />

      <Stack.Screen options={{ headerShown: false, navigationBarHidden: true }} name="PrivacySetting" component={PrivacySetting} />

    </Stack.Navigator>
  )
}

const HomeStackNavigation = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator initialRouteName='Home'>
      <Stack.Screen options={{ headerShown: false, navigationBarHidden: true }} name="Home" component={HomeScreen} />
      <Stack.Screen options={{ headerShown: false, navigationBarHidden: true }} name="PostDetail" component={PostDetail} />
      <Stack.Screen options={{ headerShown: false, navigationBarHidden: true }} name="InAppCheckIn" component={InAppCheckIn} />
      <Stack.Screen options={{ headerShown: false, navigationBarHidden: true }} name="MessageList" component={MessageList} />
      <Stack.Screen options={{ headerShown: false, navigationBarHidden: true }} name="Status" component={CreateStatus} />
      <Stack.Screen options={{
        headerShown: false, navigationBarHidden: true,
      }} name="Message" component={Message} />

      <Stack.Screen options={{
        headerShown: false, navigationBarHidden: true,
      }} name="MediaDetail" component={ChatMediaDetail} />
      <Stack.Screen options={{
        headerShown: false, navigationBarHidden: true,
      }} name="NewMessage" component={NewMessage} />
      <Stack.Screen options={{
        headerShown: false, navigationBarHidden: true,
      }} name="newGroup" component={NewGroupScreen} />
      <Stack.Screen options={{
        headerShown: false, navigationBarHidden: true,
      }} name="NewGroupSecondScreen" component={NewGroupSecondScreen} />
      <Stack.Screen options={{
        headerShown: false, navigationBarHidden: true,
      }} name="GroupMessage" component={GroupMessage} />
      <Stack.Screen options={{
        headerShown: false, navigationBarHidden: true,
      }} name="messageMedia" component={MessageMedia} />
      <Stack.Screen options={{
        headerShown: false, navigationBarHidden: true,
      }} name="GroupmessageMedia" component={GroupmessageMedia} />
      <Stack.Screen options={{
        headerShown: false, navigationBarHidden: true,
      }} name="Notification" component={Notification} />

    </Stack.Navigator>
  )
}
const PostStackNavigation = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator initialRouteName='CreatePost'>
      <Stack.Screen options={{ headerShown: false, navigationBarHidden: true }} name="CreatePost" component={CreatePost} />
      <Stack.Screen options={{ headerShown: false, navigationBarHidden: true }} name="CreatePostTwo" component={CreatePostTwo} />
      <Stack.Screen options={{ headerShown: false, navigationBarHidden: true }} name="TagPeople" component={TagPeople} />
      <Stack.Screen options={{ headerShown: false, navigationBarHidden: true }} name="PostSetting" component={PostSetting} />
    </Stack.Navigator>
  )
}
const GroupStackNavigation = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen options={{ headerShown: false, navigationBarHidden: true }} name="announcement" component={Announcement} />
      <Stack.Screen options={{ headerShown: false, navigationBarHidden: true }} name="createAnnouncement" component={CreateAnnouncement} />
      <Stack.Screen options={{ headerShown: false, navigationBarHidden: true }} name="announcementDetail" component={AnnouncementDetail} />
    </Stack.Navigator>
  )
}
export { EventStackNavigation, ProfileStackNavigation, HomeStackNavigation, PostStackNavigation, GroupStackNavigation }
