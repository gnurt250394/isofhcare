/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component, PropTypes} from 'react';
import {Text, View, Image, TouchableOpacity, StyleSheet} from 'react-native';
import ScaleImage from 'mainam-react-native-scaleimage';
import dateUtils from 'mainam-react-native-date-utils';
import ActivityPanel from '@components/ActivityPanel';
import snackbar from '@utils/snackbar-utils';
import DateMessage from '@components/chat/DateMessage';
import ImageLoad from 'mainam-react-native-image-loader';
import {connect} from 'react-redux';
import constants from '@resources/strings';

class TheirMessage extends React.Component {
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
          this.props.message.createdAt.toDateObject().format('dd/MM/yyyy') !=
            this.props.preMessage.createdAt.toDateObject().format('dd/MM/yyyy')
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
    let message = this.props.message;
    if (!message)
      message = {
        message: '',
        createdDate: new Date(),
      };
    const chatProfile = this.props.chatProfile;
    let avatar =
      chatProfile && chatProfile.avatar ? chatProfile.avatar.absoluteUrl() : '';
    return (
      <View style={{marginBottom: this.props.isLast ? 30 : 0, flex: 1}}>
        {this.state.showDate ? (
          <DateMessage message={this.props.message} />
        ) : null}
        <View style={styles.containerMessage}>
          {this.state.showAuthor || this.state.showDate ? (
            avatar ? (
              <ImageLoad
                customImagePlaceholderDefaultStyle={styles.defaultImage}
                resizeMode="cover"
                placeholderSource={require('@images/noimage.png')}
                style={styles.defaultImage}
                loadingStyle={{size: 'small', color: 'gray'}}
                borderRadius={25}
                imageStyle={styles.defaultImage}
                source={{uri: avatar}}
                defauleImage={() => {
                  return (
                    <ScaleImage
                      resizeMode="cover"
                      source={require('@images/noimage.png')}
                      width={40}
                      style={{borderRadius: 20}}
                    />
                  );
                }}
              />
            ) : (
              <View style={styles.containerImageName}>
                <Text style={styles.txtName}>
                  {chatProfile?.name
                    ?.split?.(' ')
                    .pop()
                    .trim()
                    .substring(0, 1)
                    .toUpperCase()}
                </Text>
              </View>
            )
          ) : (
            <View style={{width: 40, height: 40}} />
          )}
          <View
            style={[
              styles.containerMessageName,
              {
                borderTopLeftRadius: this.state.showAuthor ? 10 : 0,
                borderBottomLeftRadius: this.state.showAuthor ? 0 : 10,
              },
            ]}>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                paddingBottom: 10,
              }}>
              {message.images.length
                ? message.images.map((e, i) => {
                    return (
                      <TouchableOpacity
                        key={i}
                        onPress={this.photoViewer(message.images, i)}>
                        <ImageLoad
                          resizeMode="cover"
                          placeholderSource={require('@images/noimage.png')}
                          style={{width: 100, height: 100}}
                          loadingStyle={{size: 'small', color: 'gray'}}
                          source={{
                            uri: e,
                          }}
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
                  })
                : null}
            </View>
            <Text style={{textAlign: 'left', paddingHorizontal: 5}}>
              {message.content}
            </Text>

            {/* <Text style={styles.txtDate}>
              {this.props.message.createdAt.toDateObject().format('hh:mm')}
            </Text> */}
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
export default connect(mapStateToProps)(TheirMessage);

const styles = StyleSheet.create({
  txtDate: {
    marginTop: 7,
    color: '#bababa',
    fontSize: 13,
  },
  containerMessageName: {
    marginLeft: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    padding: 5,
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
    minWidth: 30,
    marginRight: 50,
    justifyContent: 'center',
    flexDirection: 'column',
  },
  txtName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  containerImageName: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: '#00000030',
    alignItems: 'center',
    justifyContent: 'center',
  },
  defaultImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  containerMessage: {
    marginLeft: 5,
    marginRight: 5,
    minHeight: 40,
    marginTop: 5,
    flexDirection: 'row',
  },
});
