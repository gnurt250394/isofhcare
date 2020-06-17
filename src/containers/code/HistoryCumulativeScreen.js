import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  ActivityIndicator,
} from 'react-native';
import ActivityPanel from '@components/ActivityPanel';
import ScaledImage from 'mainam-react-native-scaleimage';
import {Card} from 'native-base';
import {useSelector} from 'react-redux';
import userProvider from '@data-access/user-provider';
const HistoryCumulativeScreen = () => {
  const userApp = useSelector(state => state.auth.userApp);
  const [state, _setState] = useState({
    data: [],
    page: 0,
    size: 20,
    isLoading: true,
    length: 0,
    refreshing: false,
    loadMore: true,
    list: [],
  });

  const setState = (data = {}) => {
    _setState(state => ({...state, ...data}));
  };

  const getListAccumulations = async () => {
    try {
      let res = await userProvider.getListAccumulations(state.page, state.size);
      setState({isLoading: false, refreshing: false, loadMore: false});
      if (res?.code == 0) {
        let group2 = [];
        if (state.page == 0) {
          group2 = res.data.content;
        } else {
          group2 = [...state.list, ...res.data.content];
        }
        let group = group2
          .map(item => item.createdDate.toDateObject('-').format('dd/MM/yyyy'))
          .filter((item, i, ar) => ar.indexOf(item) === i)
          .map(item => {
            let new_list = group2.filter(
              itm =>
                itm.createdDate.toDateObject('-').format('dd/MM/yyyy') == item,
            );
            return {title: item, data: new_list};
          });
        formatData(group, res.data.content);
      }
    } catch (error) {
      setState({isLoading: false, refreshing: false, loadMore: false});
    }
  };
  const formatData = (data = [], list) => {
    if (list.length == 0) {
      if (state.page == 0) {
      }
    } else {
      if (state.page == 0) {
        setState({data, list});
      } else {
        setState({
          list: [...state.list, ...list],
          data,
        });
      }
    }
  };
  const loadMore = () => {
    if ((state.page + 1) * state.size <= state.list.length) {
      setState({page: state.page + 1, loadMore: true});
    }
  };
  const onRefresh = () => {
    setState({refreshing: true, page: 0});
  };
  useEffect(() => {
    if (state.refreshing || state.loadMore) getListAccumulations();
  }, [state.refreshing, state.page]);
  //   useEffect(() => {
  //     if (state.refreshing) {
  //       getListAccumulations();
  //     }
  //   }, [state.refreshing]);

  const Item = ({item}) => {
    const icon =
      item.point > 0
        ? require('@images/new/account/ic_out.png')
        : require('@images/new/account/ic_in.png');
    return (
      <Card style={styles.item}>
        <ScaledImage style={styles.icon} source={icon} width={30} height={30} />
        <View style={styles.containerItem}>
          <Text style={styles.title}>{item.description}</Text>
          <Text style={styles.txtTime}>
            {item.createdDate.toDateObject('-').format('HH:mm')}
          </Text>
        </View>
        <Text style={{color: '#00BA99'}}>
          {item.point > 0 ? '+' : ''} {item.point}
        </Text>
      </Card>
    );
  };
  const listEmpty = () =>
    !state.isLoading && <Text style={styles.txtEmpty}>Không có dữ liệu</Text>;

  const listFooter = () =>
    state.loadMore && (
      <ActivityIndicator color={'green'} size="small" style={styles.loadmore} />
    );
  return (
    <ActivityPanel
      title="Lịch sử tích luỹ điểm"
      containerStyle={styles.container}
      isLoading={state.isLoading}>
      <View style={styles.containerCount}>
        <Text style={styles.txtLabelCount}>Điểm tích luỹ</Text>
        <View style={styles.groupCount}>
          <Text style={styles.txtCount}>
            {userApp?.currentUser?.accumulatedPoint}
          </Text>
          <ScaledImage
            source={require('@images/new/account/ic_coin.png')}
            width={22}
            height={22}
          />
        </View>
      </View>
      <Text style={styles.txtHelp}>
        Mỗi tài khoản đăng kí được bạn giới thiệu sẽ tích lũy được 10 điểm.
      </Text>
      <SectionList
        sections={state.data}
        stickySectionHeadersEnabled={false}
        onEndReached={loadMore}
        onEndReachedThreshold={0.6}
        onRefresh={onRefresh}
        // ListEmptyComponent={listEmpty}
        refreshing={state.refreshing}
        ListFooterComponent={listFooter}
        keyExtractor={(item, index) => item + index}
        renderItem={({item}) => <Item item={item} />}
        renderSectionHeader={({section: {title}}) => (
          <Text style={styles.header}>Ngày {title}</Text>
        )}
      />
    </ActivityPanel>
  );
};

const styles = StyleSheet.create({
  loadmore: {
    padding: 10,
  },
  txtEmpty: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  txtTime: {
    color: '#00000095',
  },
  containerItem: {
    flex: 1,
    paddingHorizontal: 10,
  },
  icon: {
    alignSelf: 'center',
  },
  txtHelp: {
    color: '#00BA99',
    paddingRight: 50,
    fontStyle: 'italic',
    paddingTop: 10,
    paddingBottom: 20,
  },
  txtCount: {
    color: '#FF8A00',
    paddingHorizontal: 5,
  },
  groupCount: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#FF8A00',
    borderWidth: 0.7,
    borderRadius: 15,
    padding: 5,
  },
  txtLabelCount: {
    color: '#000',
    fontWeight: 'bold',
  },
  containerCount: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  container: {
    backgroundColor: '#f2f2f2',
    padding: 15,
  },
  item: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  header: {
    color: '#00000070',
    marginTop: 15,
  },
  title: {
    fontWeight: 'bold',
  },
});
export default HistoryCumulativeScreen;
