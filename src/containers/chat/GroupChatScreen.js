/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component, useEffect, useRef, useState, useContext} from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Text,
  StatusBar,
  TouchableOpacity,
  Image,
  Platform,
  Keyboard,
  AppState,
  FlatList,
} from 'react-native';
import ScaledImage from 'mainam-react-native-scaleimage';
import dateUtisl from 'mainam-react-native-date-utils';
import ActivityPanel from '@components/ActivityPanel';
import {connect, useSelector, useDispatch} from 'react-redux';
import firebaseUtils from '@utils/firebase-utils';
import GroupChatItem from '@components/chat/GroupChatItem';
import userProvider from '@data-access/user-provider';
import constants from '@resources/strings';
import ImageLoad from 'mainam-react-native-image-loader';
import clientUtils from '@utils/client-utils';
import MyFacilityItem from '@components/chat/MyFacilityItem';
import bookingDoctorProvider from '@data-access/booking-doctor-provider';
import {WebSocketContext} from '@data-access/socket-provider';
import snackbar from '@utils/snackbar-utils';
const GroupChatScreen = ({navigation}) => {
  const snap = useRef();
  const data = useRef();
  const dataIds = useRef();
  const context = useContext(WebSocketContext);
  const userApp = useSelector(state => state.auth.userApp);
  const dispatch = useDispatch();

  const [state, _setState] = useState({
    loadingGroup: true,
    listGroup: [],
    title: 'Group',
    page: 0,
    size: 20,
    data: [],
    isLoading: true,
  });

  const setState = (data = {}) => {
    _setState(state => ({...state, ...data}));
  };
  const removeGroup = id => {
    let index = dataIds.current.indexOf(id);
    if (index != -1) {
      data.current.splice(index, 1);
      dataIds.current.splice(index, 1);
    }
  };
  const addGroup = (group, index) => {
    removeGroup(group.doc.id);
    data.current.splice(index, 0, group.doc);
    dataIds.current.splice(index, 0, group.doc.id);
  };

  useEffect(() => {
    context.onSend(
      constants.socket_type.GET_LIST_GROUP,
      {userId: userApp.currentUser.id},
      data => {
        setState({data: data.data, isLoading: false});
        console.log('data: ', data);
      },
    );
    const getData = () => {
      const {page, size} = this.state;
      console.log('getData');

      bookingDoctorProvider
        .getListDoctor(page, size)
        .then(res => {
          this.setState({isLoading: false, refreshing: false});
          if (res && res.length > 0) {
            this.formatData(res);
          } else {
            this.formatData([]);
          }
        })
        .catch(err => {
          this.formatData([]);
          this.setState({isLoading: false, refreshing: false});
        });
    };
    // getData();
    return () => {
      if (snap.current) snap.current();
    };
  }, []);
  const formatData = data => {
    if (data.length == 0) {
      if (state.page == 0) {
        setState({data});
      }
    } else {
      if (state.page == 0) {
        setState({data});
      } else {
        setState(preState => {
          return {data: [...preState.data, ...data]};
        });
      }
    }
  };

  const onCreateGroup = item => () => {
    context.onSend(
      constants.socket_type.CREATE_ROOM,
      {
        roomName: item.name,
        id: item.userId,
        userId: userApp.currentUser.id,
        userName: userApp.currentUser.name,
      },
      data => {
        console.log('data: ', data);
        if (data.status) navigation.navigate('chat');
        else snackbar.show('Phòng đã tồn tại', 'danger');
      },
    );
  };
  const onChatsGroup = item => () => {
    context.onSend(
      constants.socket_type.JOIN_ROOM,
      {room: item, user: userApp.currentUser},
      data => {
        navigation.navigate('chat', {
          room: item,
        });
      },
    );
  };
  return (
    <ActivityPanel
      isLoading={state.isLoading}
      titleStyle={{marginLeft: 40}}
      title={state.title}
      menuButton={
        <TouchableOpacity
          onPress={onCreateGroup}
          style={{
            paddingRight: 15,
          }}>
          <ScaledImage
            source={require('@images/new/profile/ic_add.png')}
            height={25}
          />
        </TouchableOpacity>
      }>
      <FlatList
        keyExtractor={(item, index) => index.toString()}
        data={state.data}
        renderItem={({item, index}) => (
          <TouchableOpacity
            onPress={onChatsGroup(item)}
            style={{
              padding: 15,
              borderBottomColor: '#00000060',
              borderBottomWidth: 1,
            }}>
            <Text>{item.roomName}</Text>
          </TouchableOpacity>
        )}
      />
    </ActivityPanel>
  );
};

export default GroupChatScreen;
