import React, {Component} from 'react';
import ActivityPanel from '@components/ActivityPanel';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';
import {connect} from 'react-redux';
import ScaleImage from 'mainam-react-native-scaleimage';
import connectionUtils from '@utils/connection-utils';
import clientUtils from '@utils/client-utils';
import scheduleProvider from '@data-access/schedule-provider';
import snackbar from '@utils/snackbar-utils';
import dateUtils from 'mainam-react-native-date-utils';
import bookingProvider from '@data-access/booking-provider';
import dataCacheProvider from '@data-access/datacache-provider';
import constants from '@resources/strings';
const DEVICE_WIDTH = Dimensions.get('window').width;
import ImageLoad from 'mainam-react-native-image-loader';
import ScaledImage from 'mainam-react-native-scaleimage';
import ehealthProvider from '@data-access/ehealth-provider';
import {Card} from 'native-base';
import OpenFile from '@components/ehealth/OpenFile';

class DetailsEhealthScreen extends Component {
  constructor(props) {
    super(props);
    let id = this.props.navigation.getParam('id');

    this.state = {
      listTime: [],
      id,
    };
  }

  componentDidMount() {
    this.onGetDetails();
  }
  onGetDetails = () => {
    this.setState(
      {
        refreshing: true,
      },
      () => {
        ehealthProvider
          .uploadEhealth(null, this.state.id)
          .then(res => {
            if (res && res.code == 200) {
              // this.props.navigation.pop()
              this.setState({
                listEhealth: res.data,
                refreshing: false,
              });
            }
          })
          .catch(err => {
            this.setState({
              refreshing: false,
            });
          });
      },
    );
  };
  checkImage = link => {
    let ext = link ? /[^\.]*$/.exec(link)[0] : 'txt';
    switch (ext) {
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'png':
        return true;

      case 'doc':
      case 'docx':
      case 'pdf':
      case 'csv':
      case 'xlsx':
      case 'xlsm':
      case 'xlsb':
      case 'xltx':
      case 'xltm':
      case 'xls':
      case 'xml':
      case 'xlt':
      case 'xla':
      case 'xlw':
      case 'xlr':
        return false;
      default:
        return false;
    }
  };
  showImage = (image, item) => {
    let isImg = this.checkImage(item);
    let img = image
    .filter(e => this.checkImage(e) == true)
    .map(item => {
      return {uri: item};
    });
    let index = img.findIndex(e => e.uri == item);

    if (isImg) {
      this.props.navigation.navigate('photoViewer', {
        index: index,
        urls: img,
      });
    } else {
      // this.props.navigation.navigate('fileViewer', {
      //   index: index,
      //   urls: item,
      // });
      OpenFile(item)
    }
  };
  edit = data => {
    let dataError = data ? '' : this.state.dataError;
    if (!data || !this.state.data || data.id != this.state.data.id) {
      this.setState({id: data.id, listEhealth: data, dataError}, () => {});
    } else {
      this.setState({id: data.id, listEhealth: data, dataError}, () => {});
    }
  };
  onEdit = () => {
    var images = [];
    var dataOld = this.state.listEhealth;
    if (dataOld && dataOld.images && dataOld.images.length) {
      for (let i = 0; i < dataOld.images.length; i++) {
        if (!dataOld.images[i].uri && !dataOld.images[i].url) {
          images.push({uri: dataOld.images[i], url: dataOld.images[i]});
        }
      }
      if (images && images.length) {
        dataOld.images = images;
      }
    }
    this.props.navigation.navigate('createEhealth', {
      data: dataOld,
      onSelected: this.edit.bind(this),
    });
  };
  getImage = link => {
    let ext = link ? /[^\.]*$/.exec(link)[0] : 'txt';
    let source = '';
    switch (ext) {
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'png':
        source = {uri: link};
        break;

      case 'doc':
      case 'docx':
        source = require('@images/new/ehealth/ic_word.png');
        break;
      case 'pdf':
        source = require('@images/new/ehealth/ic_pdf.png');
        break;
      case 'csv':
      case 'xlsx':
      case 'xlsm':
      case 'xlsb':
      case 'xltx':
      case 'xltm':
      case 'xls':
      case 'xml':
      case 'xlt':
      case 'xla':
      case 'xlw':
      case 'xlr':
        source = require('@images/new/ehealth/ic_excel.png');
        break;

      default:
        source = '';
        break;
    }
    return source;
  };
  render() {
    const icSupport = require('@images/new/user.png');
    const source =
      this.state.listEhealth &&
      this.state.listEhealth.medicalRecord &&
      this.state.listEhealth.medicalRecord.avatar
        ? {uri: this.state.listEhealth.medicalRecord.avatar}
        : icSupport;

    return (
      <ActivityPanel
        titleStyle={{marginLeft: 50}}
        title={'CHI TIẾT Y BẠ'}
        style={styles.container}
        isLoading={this.state.refreshing}
        menuButton={
          <TouchableOpacity
            onPress={this.onEdit}
            style={{padding: 5, marginRight: 16}}>
            <ScaledImage
              source={require('@images/new/drug/ic_edit.png')}
              height={20}
            />
          </TouchableOpacity>
        }>
        <ScrollView>
          <View style={styles.viewInfoProfile}>
            <View style={styles.viewItem} />
            <View style={styles.viewLabel}>
              <View style={[styles.item, {marginTop: 0}]}>
                <View style={styles.round1}>
                  <View style={styles.round2} />
                </View>
                <Text style={[styles.itemlabel, styles.txLabel]}>
                  {this.state.listEhealth &&
                  this.state.listEhealth.medicalRecord
                    ? this.state.listEhealth.medicalRecord.name
                    : ''}
                </Text>
              </View>

              <View>
                <View style={styles.item}>
                  <View style={styles.round1}>
                    <View style={styles.round3} />
                  </View>
                  <Text style={styles.itemlabel}>
                    {this.state.listEhealth &&
                      this.state.listEhealth.hospitalName}
                  </Text>
                </View>
                <View style={styles.item}>
                  <View style={styles.round1}>
                    <View style={styles.round3} />
                  </View>
                  <Text style={styles.itemlabel}>
                    Dịch vụ:{' '}
                    <Text style={styles.itemcontent}>
                      {this.state.listEhealth &&
                        this.state.listEhealth.medicalServiceName}
                    </Text>
                  </Text>
                </View>
                <View style={styles.item}>
                  <View style={styles.round1}>
                    <View style={styles.round3} />
                  </View>
                  <Text style={styles.itemlabel}>KẾT QUẢ KHÁM</Text>
                </View>
              </View>
            </View>
            <ImageLoad
              resizeMode="cover"
              imageStyle={styles.imageStyle}
              borderRadius={35}
              customImagePlaceholderDefaultStyle={styles.customImage}
              placeholderSource={icSupport}
              style={styles.imgLoad}
              resizeMode="cover"
              loadingStyle={{size: 'small', color: 'gray'}}
              source={source}
              // defaultImage={() => {
              //     return (
              //         <ScaledImage
              //             resizeMode="cover"
              //             source={icSupport}
              //             width={70}
              //             style={styles.imgLoad}
              //         />
              //     );
              // }}
            />
          </View>
          <Card
            style={{
              borderRadius: 5,
              borderWidth: 1,
              alignItem: 'center',
              flex: 1,
              marginHorizontal: 10,
            }}>
            <Text
              style={{
                textAlign: 'left',
                marginVertical: 20,
                color: '#000',
                fontSize: 16,
                marginHorizontal: 10,
              }}>
              {this.state.listEhealth && this.state.listEhealth.result}
            </Text>
            {this.state.listEhealth &&
            this.state.listEhealth.images &&
            this.state.listEhealth.images.length ? (
              <View>
                <View style={styles.list_image}>
                  {this.state.listEhealth.images.map((item, index) => (
                    <TouchableOpacity
                      onPress={() =>
                        this.showImage(this.state.listEhealth.images, item)
                      }
                      key={index}
                      style={styles.containerImagePicker}>
                      <View style={styles.groupImagePicker}>
                        {item ? (
                          <Image
                            source={this.getImage(item)}
                            resizeMode="cover"
                            style={styles.imagePicker}
                          />
                        ) : null}
                        {item.error ? (
                          <View style={styles.groupImageError}>
                            <ScaledImage
                              source={require('@images/ic_warning.png')}
                              width={40}
                            />
                          </View>
                        ) : item.loading ? (
                          <View style={styles.groupImageLoading}>
                            <ScaledImage
                              source={require('@images/loading.gif')}
                              width={40}
                            />
                          </View>
                        ) : null}
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ) : null}
          </Card>
        </ScrollView>
        <View style={{height: 50}} />
      </ActivityPanel>
    );
  }
}

function mapStateToProps(state) {
  return {
    userApp: state.auth.userApp,
    ehealth: state.auth.ehealth,
  };
}
const styles = StyleSheet.create({
  list_image: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    marginHorizontal: 20,
    marginVertical: 20,
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
  itemcontent: {color: '#0076ff'},
  container: {flex: 1, backgroundColor: 'red'},
  item: {marginTop: 10, flexDirection: 'row'},
  viewInfoProfile: {flexDirection: 'row', position: 'relative', padding: 8},
  viewItem: {
    width: 1.5,
    top: 10,
    bottom: 10,
    left: 17.5,
    backgroundColor: '#8fa1aa',
    position: 'absolute',
  },
  viewLabel: {flex: 1, marginLeft: 0},
  txLabel: {fontWeight: 'bold', fontSize: 18, marginTop: 0},
  imageStyle: {
    borderRadius: 35,
    borderWidth: 0.5,
    borderColor: 'rgba(151, 151, 151, 0.29)',
  },
  customImage: {
    width: 70,
    height: 70,
    alignSelf: 'center',
  },
  imgLoad: {width: 70, height: 70},
  groupImageLoading: {
    position: 'absolute',
    left: 20,
    top: 20,
    backgroundColor: '#FFF',
    borderRadius: 20,
  },
  groupImageError: {
    position: 'absolute',
    left: 20,
    top: 20,
  },
  imagePicker: {
    width: 80,
    height: 80,
    borderRadius: 5,
  },
  groupImagePicker: {
    marginTop: 8,
    width: 80,
    height: 80,
    marginLeft: 10,
  },
});
export default connect(mapStateToProps)(DetailsEhealthScreen);
