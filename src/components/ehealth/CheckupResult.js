import React, {Component} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import dateUtils from 'mainam-react-native-date-utils';
import EhealthItem from '@components/ehealth/EhealthItem';
import {Card} from 'native-base';
import ScaledImage from 'mainam-react-native-scaleimage';
import EhealthContract from './EhealthContract';

class CheckupResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listTime: [],
      isShow: false,
      isContract: this.props.isContract,
      medical: this.props.medical,
    };
  }
  componentWillReceiveProps = preProps => {
    if (preProps.isContract != this.props.isContract) {
      this.setState({isContract: preProps.isContract});
    }
    if (preProps.medical != this.props.medical) {
      this.setState({medical: preProps.medical});
    }
  };

  onSetShow = () => {
    this.setState({isShow: !this.state.isShow});
  };
  render() {
    // if (!result?.ListResultCheckup[0]?.SummaryResult && result?.ListResultCheckup[0]?.ServiceName && !result?.ListResultCheckup[0]?.Image) {
    //     return null

    const {medical, isContract} = this.state;
    console.log('medical: ', medical);
    
    

    if (!medical) {
      return null;
    }

    return (
      <View style={styles.container}>
        <Card style={styles.card}>
          <TouchableOpacity
            onPress={this.onSetShow}
            style={[
              styles.buttonShowInfo,
              this.state.isShow ? {backgroundColor: '#3161AD'} : {},
            ]}>
            <ScaledImage
              source={require('@images/new/ehealth/ic_result.png')}
              height={19}
              style={{
                tintColor: this.state.isShow ? '#FFF' : '#3161AD',
              }}
            />
            <Text
              style={[
                styles.txtTitle,
                this.state.isShow ? {color: '#FFF'} : {},
              ]}>
              KẾT QUẢ KHÁM
            </Text>
            <ScaledImage
              source={require('@images/new/ehealth/ic_down2.png')}
              height={10}
              style={
                this.state.isShow
                  ? {
                      tintColor: '#FFF',
                    }
                  : {
                      transform: [{rotate: '-90deg'}],
                      tintColor: '#3161AD',
                    }
              }
            />
          </TouchableOpacity>
          {this.state.isShow ? (
            <View
              style={{
                padding: 10,
              }}>
              {/* {
                                !arr && resultCheckup.map((item, index) => <EhealthItem resultTest={dataTest} length={resultCheckup.length} item={item} key={index} index={index} {...this.props} />) || null
                            }
                            {
                                arrayContractCheckup.map((item, index) => <EhealthItem resultTest={dataTest} internalMedicine={item} key={index} length={arrayContractCheckup.length} index={index} {...this.props} />) || null
                            } */}
              {isContract ? (
                <EhealthContract medical={medical?.contract} />
              ) : (
                medical?.normal?.map((item, index) => (
                  <EhealthItem
                    key={index}
                    index={index}
                    length={medical?.length}
                    itemMedical={item}
                    {...this.props}
                  />
                ))
              )}
            </View>
          ) : null}
        </Card>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    userApp: state.userApp,
    ehealth: state.ehealth,
  };
}
const styles = StyleSheet.create({
  txtTitle: {
    flex: 1,
    paddingHorizontal: 10,
    color: '#3161AD',
    fontWeight: 'bold',
  },
  buttonShowInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  card: {
    borderRadius: 5,
  },
  container: {
    paddingHorizontal: 10,
  },
  round1: {
    width: 20,
    height: 20,
    backgroundColor: '#FFF',
    borderColor: '#8fa1aa',
    borderWidth: 1.5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  round2: {width: 10, height: 10, borderRadius: 5, backgroundColor: '#7daa3c'},
  round3: {width: 10, height: 10, borderRadius: 5, backgroundColor: '#c74444'},
  itemlabel: {marginLeft: 5, flex: 1, marginTop: 2},
  itemcontent: {color: '#0291E1'},
  item: {marginTop: 10, flexDirection: 'row'},
  txCheckUp: {fontWeight: 'bold', fontSize: 18},
});
export default connect(mapStateToProps)(CheckupResult);
