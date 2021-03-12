/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component, PropTypes} from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import ScaleImage from 'mainam-react-native-scaleimage';
import dateUtils from 'mainam-react-native-date-utils';
import ActivityPanel from '@components/ActivityPanel';
import snackbar from '@utils/snackbar-utils';
import DateMessage from '@components/chat/DateMessage';
import ImageLoad from 'mainam-react-native-image-loader';
import {connect} from 'react-redux';
import constants from '@resources/strings';
import {withNavigation} from 'react-navigation';

class MyMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showAuthor: !this.props.preMessage
        ? true
        : this.props.message.userId != this.props.preMessage.userId
        ? true
        : false,
      showDate: !this.props.preMessage
        ? true
        : this.props.message.createdAt &&
          this.props.preMessage.createdAt &&
          this.props.message.createdAt.toDateObject('-').format('dd/MM/yyyy') !=
            this.props.preMessage.createdAt
              .toDateObject('-')
              .format('dd/MM/yyyy')
        ? true
        : false,
    };
  }
  photoViewer = (urls, index) => () => {
    try {
      if (!urls) {
        snackbar.show(constants.msg.message.none_image);
        return;
      }
      this.props.navigation.navigate('photoViewer', {
        index,
        urls: urls.map(e => ({uri: e})),
      });
    } catch (error) {}
  };
  render() {
    let {message, loadingMessage, item} = this.props;
    if (!message)
      message = {
        message: '',
        createdAt: new Date(),
      };
    return (
      <View
        style={[
          styles.containerMessage,
          {
            // marginBottom: this.props.isLast ? 30 : 0,
            marginTop: !this.state.showDate && this.state.showAuthor ? 20 : 0,
          },
        ]}>
        {this.state.showDate ? <DateMessage message={message} /> : null}
        <View style={styles.groupMessage}>
          <View
            style={[
              styles.containerImageViewer,
              {
                borderTopRightRadius: !this.state.showDate ? 0 : 10,
                borderBottomRightRadius: !this.state.showDate ? 10 : 0,
              },
            ]}>
            {message.images.length ? (
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  paddingBottom: 10,
                }}>
                {message.images.map((e, i) => {
                  return (
                    <TouchableOpacity
                      key={i}
                      onPress={this.photoViewer(message.images, i)}>
                      <ImageLoad
                        resizeMode="cover"
                        placeholderSource={require('@images/noimage.png')}
                        style={{width: 100, height: 100}}
                        loadingStyle={{size: 'small', color: 'gray'}}
                        source={
                          item?.sensitive
                            ? require('@images/new/community/ic_sensitive.png')
                            : {
                                uri: e,
                              }
                        }
                        defaultImage={() => {
                          return (
                            <ScaleImage
                              resizeMode="cover"
                              source={require('@images/noimage.png')}
                              width={150}
                            />
                          );
                        }}
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : null}
            <Text
              style={{
                color: 'white',
                textAlign: 'right',
                paddingRight: 5,
                fontSize: 16,
              }}>
              {message.content}
            </Text>

            {/* <Text style={{marginTop: 7, color: '#FFFFFF80', fontSize: 13}}>
              {message?.createdAt?.toDateObject?.().format('hh:mm')}
            </Text> */}
            {message.id ? null : (
              <View style={styles.containerLoading}>
                <ActivityIndicator
                  size={message.type == 4 ? 'large' : 'small'}
                  color="#FFF"
                />
              </View>
            )}
          </View>
        </View>
      </View>
    );
  }
}
function mapStateToProps(state) {
  return {
    userApp: state.auth.userApp,
    navigation: state.navigation,
  };
}
export default connect(mapStateToProps)(withNavigation(MyMessage));

const styles = StyleSheet.create({
  containerLoading: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00000070',
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  containerImageViewer: {
    marginLeft: 5,
    backgroundColor: '#0090ff',
    padding: 5,
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
    minWidth: 30,
    maxWidth: '89%',
    justifyContent: 'center',
  },
  groupMessage: {
    marginLeft: 5,
    marginRight: 5,
    minHeight: 40,
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  containerMessage: {
    minHeight: 40,
    marginTop: 5,
    marginRight: 5,
  },
});
