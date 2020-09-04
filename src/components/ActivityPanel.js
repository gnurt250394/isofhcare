import React, {Component} from 'react';
import {
  Text,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  StyleSheet,
  View,
  Platform,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';
const DEVICE_WIDTH = Dimensions.get('window').width;
import constants from '@resources/strings';
import {isIphoneX} from 'react-native-iphone-x-helper';
import Activity from 'mainam-react-native-activity-panel';
import ActionBar from '@components/Actionbar';
import {connect} from 'react-redux';
import ScaledImage from 'mainam-react-native-scaleimage';
import {SafeAreaView} from 'react-navigation';
import {Card} from 'native-base';

class ActivityPanel extends Component {
  constructor(props) {
    super(props);
    // let paddingTop = Platform.select({
    //     ios: isIphoneX() ? 40 : 32,
    //     android: 0
    // });
    let paddingTop = 0;
    if (this.props.paddingTop >= 0) {
      paddingTop = this.props.paddingTop;
    }
    this.state = {
      paddingTop: paddingTop,
    };
  }
  backPress = () => {
    if (this.props.navigation) this.props.navigation.pop();
  };

  msgPress = () => {
    if (this.props.navigation) this.props.navigation.navigate('groupChat');
  };

  getActionbar() {
    return (
      <ActionBar
        actionbarTextColor={[
          {color: constants.colors.actionbar_title_color},
          this.props.actionbarTextColor,
        ]}
        backButtonClick={this.backPress}
        showMessengerClicked={this.msgPress}
        {...this.props}
        // icBack={}
        titleStyle={[styles.titleStyle, this.props.titleStyle]}
        actionbarStyle={[
          {
            paddingTop: this.state.paddingTop,
            backgroundColor: constants.colors.actionbar_color,
          },
          styles.actionbarStyle,
          this.props.actionbarStyle,
        ]}
      />
    );
  }

  getLoadingView() {
    return (
      <View style={styles.containerLoading}>
        <ActivityIndicator size={'large'} color={'#02C39A'} />
      </View>
    );
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <StatusBar translucent backgroundColor="transparent" />
        <View
          style={{position: 'relative', flex: 1, backgroundColor: '#f2f2f2'}}>
          {this.props.showBackgroundHeader ||
          this.props.showBackgroundHeader === undefined ? (
            this.props.backgroundHeader ? (
              <ScaledImage
                source={this.props.backgroundHeader}
                width={DEVICE_WIDTH}
                style={[
                  {position: 'absolute', top: 0, left: 0, right: 0},
                  this.props.backgroundStyle,
                ]}
              />
            ) : (
              <ScaledImage
                source={require('@images/app/header2.png')}
                width={DEVICE_WIDTH}
                style={{position: 'absolute', top: 0, left: 0, right: 0}}
              />
            )
          ) : null}
          {this.showBackground === false ? null : (
            <ScaledImage
              source={require('@images/new/background.png')}
              height={200}
              width={DEVICE_WIDTH}
              style={styles.imageBackground}
            />
          )}
          <SafeAreaView
            style={{
              flex: 1,
              paddingTop:
                Platform.OS === 'android' ? StatusBar.currentHeight : 0,
            }}
            forceInset={Platform.OS === 'android' && {vertical: 'never'}}>
            <Activity
              icBack={require('@images/new/left_arrow_white.png')}
              iosBarStyle={'light-content'}
              {...this.props}
              containerStyle={[styles.container, this.props.containerStyle]}
              style={{backgroundColor: 'transparent'}}
              actionbar={
                this.props.actionbar
                  ? this.props.actionbar
                  : this.getActionbar.bind(this)
              }
              loadingView={this.getLoadingView()}>
              {this.props.transparent ? (
                this.props.useCard ? (
                  <View
                    style={[
                      {flex: 1, paddingHorizontal: 10},
                      this.props.containerStyle,
                    ]}>
                    <Card
                      style={[
                        {
                          flex: 1,
                          paddingBottom: 0,
                          marginBottom: -10,
                          borderRadius: 10,
                        },
                        this.props.cardStyle,
                      ]}>
                      {this.props.children}
                    </Card>
                  </View>
                ) : (
                  this.props.children
                )
              ) : (
                <View
                  style={[
                    {
                      flex: 1,
                      backgroundColor: '#FFF',
                      borderTopLeftRadius: 6,
                      borderTopRightRadius: 6,
                    },
                    this.props.containerStyle,
                  ]}>
                  {this.props.useCard ? (
                    <Card
                      style={[
                        {
                          flex: 1,
                          paddingBottom: 0,
                          marginBottom: -10,
                          borderRadius: 10,
                        },
                        this.props.cardStyle,
                      ]}>
                      {this.props.children}
                    </Card>
                  ) : (
                    this.props.children
                  )}
                </View>
              )}
            </Activity>
          </SafeAreaView>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  imageBackground: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  container: {
    backgroundColor: '#f7f9fb',
  },
  containerLoading: {
    position: 'absolute',
    backgroundColor: '#bfeaff94',
    flex: 1,
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionbarStyle: {
    backgroundColor: '#27c8ad',
    borderBottomWidth: 0,
  },
  titleStyle: {
    color: '#FFF',
    marginLeft: 10,
  },
});
function mapStateToProps(state) {
  return {
    navigation: state.auth.navigation,
  };
}
export default connect(
  mapStateToProps,
  null,
  null,
  {forwardRef: true},
)(ActivityPanel);
