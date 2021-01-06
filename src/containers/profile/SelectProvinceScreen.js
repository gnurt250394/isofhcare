import React, {Component} from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  TextInput,
  StyleSheet,
} from 'react-native';
import {connect} from 'react-redux';
import ActivityPanel from '@components/ActivityPanel';
import constants from '@resources/strings';
import ScaleImage from 'mainam-react-native-scaleimage';
import stringUtils from 'mainam-react-native-string-utils';
import locationProvider from '@data-access/location-provider';

class SelectProvinceScreen extends Component {
  constructor(props) {
    super(props);
    let province = this.props.navigation.getParam('province', {});
    this.state = {
      listService: [],
      listServiceSearch: [],
      searchValue: '',
      refreshing: false,
      province,
    };
  }
  componentDidMount() {
    this.onRefresh();
  }
  selectProvinces(provinces) {
    let callback = ((this.props.navigation.state || {}).params || {})
      .onSelected;
    if (callback) {
      callback(provinces);
      this.props.navigation.pop();
    }
  }

  onRefresh = () => {
    this.setState({refreshing: true}, () => {
      locationProvider
        .getAllProvince()
        .then(s => {
          this.setState(
            {
              refreshing: false,
            },
            () => {
              if (s) {
                s.data.provinces.forEach(e => {
                  if (e.id == this.state.province?.id) {
                    e.selected = true;
                  }
                });
                this.setState(
                  {
                    data: s.data.provinces,
                  },
                  () => {
                    this.onSearch();
                  },
                );
              }
            },
          );
        })
        .catch(e => {
          this.setState({
            data: [],
            refreshing: false,
          });
        });
    });
  };

  showSearch() {
    this.setState({
      showSearch: !this.state.showSearch,
      searchValue: '',
    });
  }
  searchTextChange = s => {
    this.setState({searchValue: s});
  };
  onSearch = () => {
    var s = this.state.searchValue;
    var listSearch = this.state.data.filter(function(item) {
      return (
        item == null ||
        item.countryCode
          .trim()
          .toLowerCase()
          .unsignText()
          .indexOf(
            s
              .trim()
              .toLowerCase()
              .unsignText(),
          ) != -1
      );
    });
    this.setState({dataSearch: listSearch});
  };
  renderSearchButton() {
    return (
      <TouchableOpacity onPress={() => this.showSearch()} style={{padding: 10}}>
        <ScaleImage source={require('@images/ic_timkiem.png')} width={20} />
      </TouchableOpacity>
    );
  }
  goBack = () => this.props.navigation.pop();
  keyExtractor = (item, index) => index.toString();
  headerComponent = () => {
    return !this.state.refreshing &&
      (!this.state.dataSearch || this.state.dataSearch.length == 0) ? (
      <View style={styles.containerSearchValue}>
        <ScaleImage source={require('@images/empty_result.png')} width={120} />
        <Text>
          {constants.none_service_type_match}
          <Text style={styles.txtSearchValue}>{this.state.searchValue}</Text>
        </Text>
      </View>
    ) : null;
  };
  footerComponent = () => <View style={{height: 10}} />;
  renderItem = ({item}) => {
    return (
      <TouchableOpacity onPress={this.selectProvinces.bind(this, item)}>
        <View
          style={[
            styles.containerItem,
            item?.selected ? {backgroundColor: '#DEE6F2'} : {},
          ]}>
          <Text style={styles.txtItem}>{item.countryCode}</Text>
          {item?.selected ? (
            <ScaleImage
              source={require('@images/new/ic_verified.png')}
              height={18}
            />
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };
  render() {
    return (
      <ActivityPanel
        backButton={
          <TouchableOpacity style={{paddingLeft: 20}} onPress={this.goBack}>
            <Text>{constants.actionSheet.cancel}</Text>
          </TouchableOpacity>
        }
        titleStyle={{marginRight: 0}}
        title={'Chọn Tỉnh/Thành phố'}
        isLoading={this.state.isLoading}
        menuButton={this.renderSearchButton()}
        showFullScreen={true}>
        {this.state.showSearch ? (
          <View style={styles.containerSearch}>
            <TextInput
              autoFocus={true}
              style={styles.inputSearch}
              placeholderTextColor="#dddddd"
              underlineColorAndroid="transparent"
              placeholder={constants.ehealth.inputKeyword}
              onChangeText={this.searchTextChange}
              returnKeyType="search"
              onSubmitEditing={this.onSearch}
            />
            <TouchableOpacity onPress={this.onSearch}>
              <Text style={styles.txtSearch}>{constants.search}</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <FlatList
          style={styles.flatList}
          refreshing={this.state.refreshing}
          onRefresh={this.onRefresh}
          keyExtractor={this.keyExtractor}
          extraData={this.state}
          ListHeaderComponent={this.headerComponent}
          ListFooterComponent={this.footerComponent}
          data={this.state.dataSearch}
          renderItem={this.renderItem}
        />
      </ActivityPanel>
    );
  }
}
function mapStateToProps(state) {
  return {
    userApp: state.auth.userApp,
  };
}

export default connect(mapStateToProps)(SelectProvinceScreen);

const styles = StyleSheet.create({
  txtItem: {
    fontWeight: 'bold',
  },
  containerItem: {
    marginBottom: 2,
    backgroundColor: '#FFF',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: '#00000011',
    borderBottomWidth: 0.7,
  },
  txtSearchValue: {
    fontWeight: 'bold',
    color: constants.colors.actionbar_title_color,
  },
  containerSearchValue: {
    width: '100%',
    marginTop: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatList: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  txtSearch: {
    backgroundColor: constants.colors.actionbar_title_color,
    padding: 7,
    borderRadius: 20,
    marginRight: 10,
    paddingLeft: 15,
    paddingRight: 15,
    fontWeight: 'bold',
    color: '#FFF',
  },
  inputSearch: {
    flex: 1,
    color: constants.colors.actionbar_title_color,
    padding: 10,
  },
  containerSearch: {
    justifyContent: 'space-between',
    elevation: 5,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: constants.colors.actionbar_color,
    flexDirection: 'row',
  },
});
