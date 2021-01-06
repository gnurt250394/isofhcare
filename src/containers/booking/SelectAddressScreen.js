import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';
import ActivityPanel from '@components/ActivityPanel';
import {connect} from 'react-redux';
import Form from 'mainam-react-native-form-validate/Form';
import Field from 'mainam-react-native-form-validate/Field';
import TextField from 'mainam-react-native-form-validate/TextField';
import snackbar from '@utils/snackbar-utils';
class SelectAddressScreen extends Component {
  constructor(props) {
    super(props);

    let dataLocation = this.props.navigation.getParam('dataLocation', null);
    let provinces = dataLocation && dataLocation.provinces;
    let districts = dataLocation && dataLocation.districts;
    let zone = dataLocation && dataLocation.zone;
    let address = dataLocation && dataLocation.address;
    this.state = {
      isLoading: false,
      provinces,
      districts,
      zone,
      address,
    };
  }
  selectDistrict = districts => {
    let districtsError = districts ? '' : this.state.districtsError;
    if (
      !districts ||
      !this.state.districts ||
      districts.id != this.state.districts.id
    ) {
      this.setState({districts, districtsError, zone: null}, () => {
        this.onSelectZone();
      });
    } else {
      this.setState({districts, districtsError});
    }
  };
  onSelectDistrict = () => {
    if (this.state.provinces) {
      this.props.navigation.navigate('selectDistrict', {
        onSelected: this.selectDistrict.bind(this),
        id: this.state.provinces.id,
        district: this.state.districts,
      });
    } else {
      snackbar.show('Bạn chưa chọn Tỉnh/Thành phố');
    }
  };
  selectprovinces(provinces) {
    let provincesError = provinces ? '' : this.state.provincesError;
    if (
      !provinces ||
      !this.state.provinces ||
      provinces.id != this.state.provinces.id
    ) {
      this.setState(
        {provinces, provincesError, districts: null, zone: null},
        () => {
          this.onSelectDistrict();
        },
      );
    } else {
      this.setState({provinces, provincesError});
    }
  }
  onSelectProvince = () => {
    this.props.navigation.navigate('selectProvince', {
      onSelected: this.selectprovinces.bind(this),
      province: this.state.provinces,
    });
  };
  selectZone = zone => {
    let zoneError = zone ? '' : this.state.zoneError;
    if (!zone || !this.state.zone || zone.id != this.state.zone.id) {
      this.setState({zone, zoneError});
    } else {
      this.setState({zone, zoneError});
    }
  };
  onSelectZone = () => {
    if (!this.state.provinces) {
      snackbar.show('Bạn chưa chọn Tỉnh/Thành phố');
      return;
    }
    if (!this.state.districts) {
      snackbar.show('Bạn chưa chọn Quận/Huyện');
      return;
    }
    if (this.state.provinces.id && this.state.districts.id) {
      this.props.navigation.navigate('selectZone', {
        onSelected: this.selectZone.bind(this),
        id: this.state.districts.id,
        zone: this.state.zone
      });
      return;
    }
  };
  _replaceSpace(str) {
    if (str) return str.replace(/\u0020/, '\u00a0');
  }

  onChangeText = type => text => {
    this.setState({[type]: text});
  };

  onCreateProfile = () => {
    const {provinces, districts, zone, address} = this.state;
    Keyboard.dismiss();

    if (!provinces) {
      snackbar.show('Bạn chưa chọn Tỉnh/Thành phố');
      return;
    }
    if (!districts) {
      snackbar.show('Bạn chưa chọn Quận/Huyện');
      return;
    }
    if (!zone) {
      snackbar.show('Bạn chưa chọn Xã/Phường');
      return;
    }
    let onSelected = this.props.navigation.getParam('onSelected');
    this.props.navigation.pop();
    let dataLocation = {provinces, districts, zone, address};
    if (onSelected) onSelected(dataLocation);
  };
  render() {
    const {isLoading} = this.state;
    return (
      <ActivityPanel
        title={'Nhập địa chỉ'}
        isLoading={isLoading}
        menuButton={
          <TouchableOpacity
            onPress={this.onCreateProfile}
            style={styles.buttonSave}>
            <Text style={styles.txtSave}>Lưu</Text>
          </TouchableOpacity>
        }
        titleStyle={styles.titleStyle}
        containerStyle={{
          backgroundColor: '#E5E5E5',
        }}>
        <KeyboardAvoidingView style={{flex: 1}}>
          <Form ref={ref => (this.form = ref)} style={[{flex: 1}]}>
            <Field style={[styles.mucdichkham]}>
              <Text style={styles.mdk}>{'Tỉnh/Thành phố'}</Text>
              <Field>
                <TextField
                  hideError={true}
                  onPress={this.onSelectProvince}
                  editable={false}
                  multiline={true}
                  inputStyle={[
                    styles.ktq,
                    {minHeight: 41},
                    this.state.provinces && this.state.provinces.countryCode
                      ? {}
                      : {color: '#8d8d8d'},
                  ]}
                  errorStyle={styles.errorStyle}
                  value={
                    this.state.provinces && this.state.provinces.countryCode
                      ? this.state.provinces.countryCode
                      : 'Tỉnh/Thành phố'
                  }
                  autoCapitalize={'none'}
                  // underlineColorAndroid="transparent"
                  autoCorrect={false}
                />
              </Field>
            </Field>

            <Field style={[styles.mucdichkham]}>
              <Text style={styles.mdk}>Quận/Huyện</Text>
              <Field>
                <TextField
                  hideError={true}
                  multiline={true}
                  inputStyle={[
                    styles.ktq,
                    this.state.districts && this.state.districts.name
                      ? {}
                      : {color: '#8d8d8d'},
                    {minHeight: 41},
                  ]}
                  onPress={this.onSelectDistrict}
                  editable={false}
                  errorStyle={styles.errorStyle}
                  value={
                    this.state.districts && this.state.districts.name
                      ? this.state.districts.name
                      : 'Quận/Huyện'
                  }
                  autoCapitalize={'none'}
                  // underlineColorAndroid="transparent"
                  autoCorrect={false}
                />
              </Field>
            </Field>
            <Field style={[styles.mucdichkham]}>
              <Text style={styles.mdk}>Xã/Phường</Text>
              <Field>
                <TextField
                  hideError={true}
                  multiline={true}
                  onPress={this.onSelectZone}
                  editable={false}
                  inputStyle={[
                    styles.ktq,
                    {minHeight: 41},
                    this.state.zone && this.state.zone.name
                      ? {}
                      : {color: '#8d8d8d'},
                  ]}
                  errorStyle={styles.errorStyle}
                  value={
                    this.state.zone && this.state.zone.name
                      ? this.state.zone.name
                      : 'Xã/Phường'
                  }
                  autoCapitalize={'none'}
                  // underlineColorAndroid="transparent"
                  autoCorrect={false}
                />
              </Field>
            </Field>

            <Field style={[styles.mucdichkham]}>
              <Text style={styles.mdk}>Địa chỉ</Text>
              <TextField
                hideError={true}
                onValidate={(valid, messages) => {
                  if (valid) {
                    this.setState({addressError: ''});
                  } else {
                    this.setState({addressError: messages});
                  }
                }}
                placeholder={'Nhập địa chỉ'}
                // multiline={true}
                inputStyle={[styles.ktq]}
                errorStyle={styles.errorStyle}
                onChangeText={this.onChangeText('address')}
                value={this._replaceSpace(this.state.address)}
                autoCapitalize={'none'}
                // underlineColorAndroid="transparent"
                autoCorrect={false}
              />
            </Field>
            <Text style={[styles.errorStyle]}>{this.state.addressError}</Text>
          </Form>
        </KeyboardAvoidingView>
      </ActivityPanel>
    );
  }
}
const styles = StyleSheet.create({
  buttonSave: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  txtSave: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  titleStyle: {
    paddingLeft: 50,
  },
  mucdichkham: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    backgroundColor: '#FFF',
    borderBottomColor: '#BBB',
    borderBottomWidth: 0.6,
  },
  mdk: {
    marginLeft: 12,
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: '#000000',
  },

  ktq: {
    fontSize: 12,
    fontWeight: 'bold',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: '#000',
    paddingHorizontal: 10,
    minHeight: 41,
    textAlign: 'right',
    marginTop: 10,
    textAlignVertical: 'top',
    minWidth: 150,
  },
  errorStyle: {
    color: 'red',
    marginLeft: 13,
  },
});
export default connect()(SelectAddressScreen);
