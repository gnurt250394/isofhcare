import React, {Component, PropTypes} from 'react';
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
import specialistProvider from '@data-access/specialist-provider';
import constants from '@resources/strings';
import ScaleImage from 'mainam-react-native-scaleimage';
import snackbar from '@utils/snackbar-utils';
import dataCacheProvider from '@data-access/datacache-provider';
import bookingDoctorProvider from '@data-access/booking-doctor-provider';

class SelectSpecialistScreen extends Component {
  constructor(props) {
    super(props);
    let listSelected = this.props.navigation.getParam('listSelected', []);
    this.state = {
      listSpecialist: [],
      listSpecialistSearch: [],
      searchValue: '',
      refreshing: false,
      listSelected,
      page: 0,
      size: 20,
      isLoading: true,
    };
    this.listSpecialist = listSelected;
  }
  componentDidMount() {
    this.onRefresh();
  }
  selectSpecilist(item, index) {
    let data = [...this.state.listSelected];

    let i = data.findIndex(e => e.id == item.id);

    if (i == -1 && data.length >= 3) {
      data.shift();
      data.push(item);
    } else {
      if (i != -1) {
        data.splice(i, 1);
      } else {
        data.push(item);
      }
    }
    this.setState({
      listSelected: data,
    });
  }

  onRefresh = () => {
    this.setState({refreshing: true, page: 0}, this.getData);
  };
  getData = () => {
    bookingDoctorProvider
      .get_list_specialists(this.state.page, this.state.size)
      .then(s => {
        this.setState({
          refreshing: false,
          isLoading: false,
          isSearch: false,
        });
        if (s?.length) {
          this.formatData(s);
        } else {
          this.formatData([]);
        }
      })
      .catch(e => {
        this.formatData([]);
        this.setState({
          isLoading: false,
          refreshing: false,
          isSearch: false,
        });
      });
  };
  formatData = data => {
    if (data.length == 0) {
      if (this.state.page == 0) {
        this.setState({listSpecialistSearch: []});
      }
    } else {
      if (this.state.page == 0) {
        this.setState({listSpecialistSearch: data});
      } else {
        this.setState(pre => ({
          listSpecialistSearch: [...pre.listSpecialistSearch, ...data],
        }));
      }
    }
  };
  _onEndReached = () => {
    const {page, size, listSpecialistSearch} = this.state;
    if (listSpecialistSearch.length >= (page + 1) * size) {
      this.setState(pre => ({page: pre.page + 1}), this.getData);
    }
  };
  showSearch = () => {
    this.setState({
      showSearch: !this.state.showSearch,
      searchValue: '',
    });
  };
  searchTextChange = s => {
    if (!s) {
      this.setState({page: 0, isLoading: true}, this.getData);
    }
    this.setState({searchValue: s});
  };
  onSearch = () => {
    this.setState({isLoading: true, isSearch: true}, () => {
      bookingDoctorProvider
        .search_list_specialists(this.state.searchValue)
        .then(s => {
          this.setState({
            refreshing: false,
            isLoading: false,
          });
          if (s) {
            this.setState({listSpecialistSearch: s});
          } else {
            this.setState({listSpecialistSearch: []});
          }
        })
        .catch(e => {
          this.setState({listSpecialistSearch: []});
          this.setState({
            isLoading: false,
            refreshing: false,
          });
        });
    });
  };
  onSelected = listSelected => () => {
    let callback = ((this.props.navigation.state || {}).params || {})
      .onSelected;
    if (callback) {
      callback(listSelected);
      this.props.navigation.pop();
      dataCacheProvider.save(
        this.props.userApp.currentUser.id,
        constants.key.storage.LASTEST_SPECIALIST,
        listSelected,
      );
    }
  };
  renderSearchButton() {
    let listSelected = this.state.listSelected;
    if (listSelected.length) {
      return (
        <TouchableOpacity
          onPress={this.onSelected(listSelected)}
          style={{padding: 10}}>
          <ScaleImage
            source={require('@images/new/ic_checked.png')}
            width={20}
          />
        </TouchableOpacity>
      );
    }
    // return (
    //   <TouchableOpacity onPress={this.showSearch} style={{padding: 10}}>
    //     <ScaleImage source={require('@images/new/ic_search.png')} width={20} />
    //   </TouchableOpacity>
    // );
  }
  goBack = () => this.props.navigation.pop();
  keyExtractor = (item, index) => index.toString();
  headerComponent = () => {
    return !this.state.refreshing &&
      (!this.state.listSpecialistSearch ||
        this.state.listSpecialistSearch.length == 0) ? (
      <View style={styles.containerHeaderSearch}>
        <ScaleImage source={require('@images/empty_result.png')} width={120} />
        <Text>
          {constants.booking.specialist_not_found}{' '}
          <Text style={styles.txtValueSearch}>{this.state.searchValue}</Text>
        </Text>
      </View>
    ) : null;
  };
  footerComponent = () => <View style={{height: 10}} />;
  renderItem = ({item, index}) => {
    const isChecked = this.state.listSelected.find(e => e.id == item.id);
    return (
      <TouchableOpacity onPress={this.selectSpecilist.bind(this, item, index)}>
        <View
          style={[
            styles.containerItem,
            {backgroundColor: isChecked ? '#00BA9930' : '#FFF'},
          ]}>
          <Text style={styles.txtItemName}>{item.name}</Text>
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
        title={constants.title.select_specialist}
        isLoading={this.state.isLoading}
        menuButton={this.renderSearchButton()}
        showFullScreen={true}>
        <View style={styles.containerSearch}>
          <TextInput
            style={styles.inputSearch}
            placeholderTextColor="#dddddd"
            underlineColorAndroid="transparent"
            placeholder={constants.ehealth.inputKeyword}
            onChangeText={this.searchTextChange}
            returnKeyType="search"
            onSubmitEditing={this.onSearch}
          />
          <TouchableOpacity
            style={{
              backgroundColor: constants.colors.actionbar_title_color,
              padding: 7,
              borderRadius: 20,
              marginRight: 10,
              paddingLeft: 15,
              paddingRight: 15,
            }}
            onPress={this.onSearch}>
            <Text style={styles.txtSearch}>{constants.search}</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          style={styles.flatlit}
          refreshing={this.state.refreshing}
          onRefresh={this.onRefresh}
          keyExtractor={this.keyExtractor}
          extraData={this.state}
          ListHeaderComponent={this.headerComponent}
          ListFooterComponent={this.footerComponent}
          data={this.state.listSpecialistSearch}
          renderItem={this.renderItem}
          onEndReached={this._onEndReached}
          onEndReachedThreshold={0.7}
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

export default connect(mapStateToProps)(SelectSpecialistScreen);

const styles = StyleSheet.create({
  txtItemName: {fontWeight: 'bold'},
  containerItem: {
    marginBottom: 2,
    backgroundColor: '#FFF',
    padding: 20,
    flexDirection: 'column',
    borderBottomColor: '#00000011',
    borderBottomWidth: 0.7,
  },
  txtValueSearch: {
    fontWeight: 'bold',
    color: constants.colors.actionbar_title_color,
  },
  containerHeaderSearch: {
    width: '100%',
    marginTop: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatlit: {flex: 1, backgroundColor: '#FFF'},
  txtSearch: {
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
    borderBottomColor: '#BBBBBB60',
    borderBottomWidth: 3,
  },
});
