import React, {useState, useEffect, memo} from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
} from 'react-native';
import NavigationService from '@navigators/NavigationService';
import questionProvider from '@data-access/question-provider';
const {height, width} = Dimensions.get('screen');
const ListSpecialQuestion = ({onSelected, onFocus}) => {
  const [specialist, setSpecialist] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  useEffect(() => {
    if (onFocus) getListSpecialist();
  }, [page, onFocus]);
  const getListSpecialist = () => {
    questionProvider
      .getListSpecialist()
      .then(res => {
        if (res?.length > 0) {
          setSpecialist(
            res.map(item => ({
              name: item.specializationName,
              id: item.specializationId,
            })),
          );
        }
      })
      .catch(err => {});
  };
  const formatData = data => {
    if (data.length == 0) {
      if (page == 0) {
        setSpecialist(preState => []);
      }
    } else {
      if (page == 0) {
        setSpecialist(preState => [{name: 'Tất cả', id: 0}, ...data]);
      } else {
        setSpecialist(preState => [...preState, ...data]);
      }
    }
  };
  const loadMoreSpecialist = () => {
    if (specialist.length >= (page + 1) * size) {
      setPage(preState => preState + 1);
    }
  };
  const onSelectSpecial = item => () => {
    onSelected && onSelected(item);
    let data = [...specialist];
    data.forEach(e => {
      if (e.id == item.id) {
        e.selected = true;
      } else {
        e.selected = false;
      }
    });
    setSpecialist(data);
    console.log('item: ', item);
  };
  const renderListSpecialist = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={onSelectSpecial(item)}
        style={[
          styles.containerItemSpecialist,
          {
            // backgroundColor: '#00CBA7',
            backgroundColor: item.selected ? '#3161AD' : '#FFF',
          },
        ]}>
        {/* <ScaleImage source={require('@images/new/user.png')} width={19} /> */}
        <Text
          style={{
            color: item.selected ? '#FFF' : '#3161AD',
            fontWeight: 'bold',
          }}
          numberOfLines={1}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };
  const _onSelected = item => {
    let data = specialist.map(e => {
      if (e.id == item.id) {
        e.selected = true;
      } else {
        e.selected = false;
      }
      return e;
    });
    setSpecialist(data);
    onSelected(item);
  };
  const keyExtractor = (item, index) => `${index}`;
  const goToListSpecial = () => {
    NavigationService.navigate('listSpecialist', {
      onSelected: _onSelected,
    });
  };
  return (
    <View
      style={{
        backgroundColor: '#00000010',
        paddingVertical: 10,
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 15,
          paddingBottom: 8,
          paddingTop: 9,
        }}>
        <Text>Chuyên khoa</Text>
        <TouchableOpacity onPress={goToListSpecial} hitSlop={styles.hislop}>
          <Text
            style={{
              color: '#0094FF',
            }}>
            Xem tất cả chuyên khoa
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={specialist}
        showsHorizontalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={{
          paddingRight: 10,
        }}
        renderItem={renderListSpecialist}
        keyExtractor={keyExtractor}
        horizontal={true}
        // onEndReached={loadMoreSpecialist}
        // onEndReachedThreshold={0.7}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  hislop: {
    top: 10,
    bottom: 10,
    right: 10,
    left: 10,
  },
  containerItemSpecialist: {
    // maxWidth: width / 2.5,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    borderRadius: 30,
    padding: 10,
    paddingHorizontal: 15,
    borderColor: '#3161AD50',
    borderWidth: 1,
  },
});
export default memo(ListSpecialQuestion);
