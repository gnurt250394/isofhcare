import React, {Component} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import ScaleImage from 'mainam-react-native-scaleimage';
import constants from '@resources/strings';
import {Table, TableWrapper, Row, Cell} from 'react-native-table-component';
import resultUtils from '@ehealth/utils/result-utils';
import ActionSheet from 'react-native-actionsheet';
import ImageEhealth from './ImageEhealth';
import {Card} from 'native-base';
import ScaledImage from 'mainam-react-native-scaleimage';
import {object} from 'prop-types';
import CustomMenu from '@components/CustomMenu';

class MedicalTestResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: false,
    };
  }
  componentDidMount() {
    this.onGetData(this.props.medicalTest);
  }

  onGetData = medicalTest => {
    if (!medicalTest) return null;
    var listHaveChild = [];
    for (var key in medicalTest) {
      if (!medicalTest[key].length) {
        delete medicalTest[key];
      } else {
        var listHaveChild = medicalTest[key].filter(
          obj => obj?.lines?.length && !obj.isNotChild,
        );

        var dataNotChild = [];
        medicalTest[key].map((obj, i) => {
          if (
            Object.keys(obj?.result || {}).length &&
            key !== 'anatomy' &&
            !obj?.lines?.length
          ) {
            obj.lines = [];
            if (!obj.result.nameLine) {
              obj.result.nameLine = obj.serviceName;
            }
            dataNotChild.push(obj.result);
            medicalTest[key] = [
              {
                lines: obj.lines.concat(dataNotChild),
                serviceName: obj.serviceName,
                isNotChild: true,
              },
            ].concat(listHaveChild);
          }
        });
      }
    }

    let firstKey = Object.keys(medicalTest)[0];
    let actions = this.renderKey(medicalTest);
    let tableHead = ['TÊN XÉT NGHIỆM', 'KẾT QUẢ'];
    let keySelect = this.renderLabel(firstKey);
    let currentGroup =
      medicalTest[firstKey] && medicalTest[firstKey].filter(obj => obj);
    this.setState({
      listTime: [],
      medicalTest,
      tableHead,
      actions,
      currentGroup: currentGroup,
      keySelect: keySelect,
      valueSelect: firstKey,
      // currentGroup: medicalTest[0]
    });
  };
  componentWillReceiveProps(nextProps) {
    if (this.props.medicalTest != nextProps.medicalTest) {
      this.onGetData(nextProps.medicalTest);
    }
  }
  renderKey = medicalTest => {
    var actions = Object.keys(medicalTest).map(item => {
      switch (item) {
        case 'hematology':
          return 'Huyết học';
        case 'biochemistry':
          return 'Hoá sinh';
        case 'microbiology':
          return 'Vi sinh';
        case 'anatomy':
          return 'Giải phẫu bệnh';
        case 'other':
          return 'Xét nghiệm khác';
        default:
          return '';
      }
    });
    actions.push('Hủy');

    return actions;
  };
  viewGroup(item) {
    this.setState({
      currentGroup: item,
    });
  }

  renderLabel = type => {
    var key = '';
    switch (type) {
      case 'hematology':
        return (key = 'Huyết học');
      case 'biochemistry':
        return (key = 'Hoá sinh');
      case 'microbiology':
        return (key = 'Vi sinh');
      case 'anatomy':
        return (key = 'Giải phẫu bệnh');
      case 'other':
        return (key = 'Xét nghiệm khác');
      default:
        return key;
    }
  };

  onSelect = (index, medicalTest) => {
    if (index <= Object.keys(medicalTest).length - 1) {
      let valueSelect = Object.keys(medicalTest)[index];
      let tableHead = ['TÊN XÉT NGHIỆM', 'KẾT QUẢ'];
      let textSelect = this.renderLabel(valueSelect);
      let currentGroup = medicalTest[valueSelect].filter(obj => obj);
      this.setState({
        currentGroup: currentGroup,
        keySelect: textSelect,
        tableHead,
        valueSelect,
      });
    }
  };
  renderMedicalTestLine(item, index) {
    return (
      <View key={index}>
        <Cell
          data={item.serviceName}
          textStyle={[styles.textValue, {fontWeight: 'bold'}]}
          style={styles.containerValue}
        />
        {item.ServiceMedicTestLine.map((item2, i) => {
          var range = resultUtils.getRangeMedicalTest(item2);

          var isHighlight = resultUtils.showHighlight(item2);
          let borderBottomWidth =
            i == item.ServiceMedicTestLine.length - 1 ? 0.6 : 0;

          return (
            <TableWrapper
              style={[
                styles.tableWrapper,
                index % 2 == 0
                  ? {backgroundColor: '#f5f5f5'}
                  : {backgroundColor: '#fff'},
              ]}
              key={i}>
              <Cell
                style={[styles.LineCell, {borderBottomWidth}]}
                data={item2?.nameLine?.trim()}
                borderStyle={{borderWidth: 0.6}}
                textStyle={[styles.textValue]}
              />
              <Cell
                data={
                  <CustomMenu
                    MenuSelectOption={
                      <Text
                        style={[
                          {padding: 10},
                          isHighlight ? {fontWeight: 'bold', color: 'red'} : {},
                        ]}>
                        {resultUtils.getResult(item2)}
                      </Text>
                    }
                    customOption={
                      <View
                        style={{
                          padding: 10,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Text style={{fontWeight: 'bold'}}>
                          Giá trị bình thường
                        </Text>
                        <Text style={{color: '#86899B'}}>
                          {item?.normalRange} {item?.unit}
                        </Text>
                      </View>
                    }
                    // onSelected={onSelected}
                  />
                }
                style={[
                  styles.flex,
                  {borderBottomWidth},
                  {alignItems: 'flex-end'},
                ]}
                borderStyle={{borderWidth: 0.6}}
                textStyle={[
                  styles.textValue,
                  isHighlight ? {fontWeight: 'bold', color: 'red'} : {},
                ]}
              />
            </TableWrapper>
          );
        })}
      </View>
    );
  }
  onSetShow = () => {
    this.setState({isShow: !this.state.isShow});
  };
  renderMedical(item, index) {
    console.log('item: ', item);
    let borderBottomWidth = 0;
    if (
      item.serviceMedicTestLine &&
      item.serviceMedicTestLine.length > 0 &&
      item.serviceMedicTestLine[0].nameLine != 0
    ) {
      return this.renderMedicalTestLine(item, index);
    }
    if (item.serviceMedicTestLine && item.serviceMedicTestLine.length > 0) {
      var range = resultUtils.getRangeMedicalTest(item.serviceMedicTestLine[0]);
      var isHighlight = resultUtils.showHighlight(item.serviceMedicTestLine[0]);

      var data = (
        <TableWrapper
          style={[
            styles.tableWrapper,
            index % 2 == 0
              ? {backgroundColor: '#f5f5f5'}
              : {backgroundColor: '#fff'},
          ]}
          key={index}>
          <Cell
            data={item.nameLine.trim()}
            borderStyle={{borderWidth: 0}}
            style={[styles.LineCell, {borderBottomWidth}]}
            textStyle={[styles.textValue]}
          />

          <Cell
            data={
              <CustomMenu
                MenuSelectOption={
                  <Text
                    style={[
                      {padding: 10},
                      isHighlight ? {fontWeight: 'bold', color: 'red'} : {},
                    ]}>
                    {resultUtils.getResult(item.ServiceMedicTestLine[0])}
                  </Text>
                }
                customOption={
                  <View
                    style={{
                      padding: 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text style={{fontWeight: 'bold'}}>
                      Giá trị bình thường
                    </Text>
                    <Text style={{color: '#86899B'}}>
                      {item?.normalRange} {item?.unit}
                    </Text>
                  </View>
                }
                // onSelected={onSelected}
              />
            }
            style={[styles.flex, {borderBottomWidth}, {alignItems: 'flex-end'}]}
            borderStyle={{borderWidth: 0}}
            textStyle={[styles.textValue]}
          />
        </TableWrapper>
      );
      return data;
    }
    var range = resultUtils.getRangeMedicalTest(item);
    var isHighlight = resultUtils.showHighlight(item);

    var data = (
      <TableWrapper
        style={[
          styles.tableWrapper,
          index % 2 == 0
            ? {backgroundColor: '#f5f5f5'}
            : {backgroundColor: '#fff'},
        ]}
        key={index}>
        <Cell
          data={item?.nameLine?.trim()}
          style={[styles.LineCell, {borderBottomWidth}]}
          borderStyle={{borderWidth: 0}}
          textStyle={[styles.textValue, {fontWeight: 'bold'}]}
        />
        <Cell
          data={
            <CustomMenu
              MenuSelectOption={
                <Text
                  style={[
                    {padding: 10},
                    isHighlight ? {fontWeight: 'bold', color: 'red'} : {},
                  ]}>
                  {resultUtils.getResult(item)}
                </Text>
              }
              customOption={
                <View
                  style={{
                    padding: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text style={{fontWeight: 'bold'}}>Giá trị bình thường</Text>
                  <Text style={{color: '#86899B'}}>
                    {item?.normalRange} {item?.unit}
                  </Text>
                </View>
              }
              // onSelected={onSelected}
            />
          }
          borderStyle={{borderWidth: 0}}
          style={[styles.flex, {borderBottomWidth}, {alignItems: 'flex-end'}]}
          textStyle={[
            styles.textValue,
            isHighlight ? {fontWeight: 'bold', color: 'red'} : {},
          ]}
        />
      </TableWrapper>
    );
    return data;
  }
  renderAtomy(obj) {
    return (
      <View style={styles.result}>
        <Text
          style={[
            styles.groupName,
            {color: '#000000', fontSize: 14, marginTop: -10},
          ]}>
          {obj?.serviceName?.toUpperCase()}
        </Text>
        {obj?.result?.nameLine ? (
          <View style={{marginTop: 5}}>
            <Text style={styles.diagnosticLabel}>{'Mô tả'}</Text>
            <View style={styles.containerTitle}>
              <ScaleImage
                source={require('@images/new/ehealth/ic_dot.png')}
                width={5}
                style={{marginRight: 10}}
              />
              <Text>{obj?.result?.nameLine}</Text>
            </View>
          </View>
        ) : null}
        {obj?.result?.result ? (
          <View>
            <Text style={styles.diagnosticLabel}>{'Kết quả'}</Text>
            <View style={styles.containerTitle}>
              <ScaleImage
                source={require('@images/new/ehealth/ic_dot.png')}
                width={5}
                style={{marginRight: 10}}
              />
              <Text>{obj?.result?.result}</Text>
            </View>
          </View>
        ) : null}
        {obj?.result?.conclusion ? (
          <View>
            <Text style={styles.diagnosticLabel}>{'Kết luận'}</Text>
            <View style={styles.containerTitle}>
              <ScaleImage
                source={require('@images/new/ehealth/ic_dot.png')}
                width={5}
                style={{marginRight: 10}}
              />
              <Text>{obj?.result?.conclusion}</Text>
            </View>
          </View>
        ) : null}
      </View>
    );

    //
    // return
    // return this.state.currentGroup.value.lines.map((data, i) => (
    //     this.renderMedical(data, i)
    // ))
  }

  render() {
    if (!this.state.currentGroup?.length) {
      return null;
    }

    let medicalTest = this.state.medicalTest;

    return (
      <View style={{flex: 1, paddingHorizontal: 10}}>
        <Card style={styles.card}>
          <TouchableOpacity
            onPress={this.onSetShow}
            style={[
              styles.buttonShowInfo,
              this.state.isShow ? {backgroundColor: '#3161AD'} : {},
            ]}>
            <ScaledImage
              source={require('@images/new/ehealth/ic_test_results.png')}
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
              KẾT QUẢ XÉT NGHIỆM
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
            <View style={{}}>
              {this.state.currentGroup && (
                <TouchableOpacity
                  onPress={() => {
                    this.actionSheetChooseType.show();
                  }}
                  style={styles.viewType}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={[styles.groupName]}>
                      {this.state.keySelect}
                    </Text>
                    <ScaleImage
                      style={{tintColor: '#0291E1', marginTop: 5}}
                      source={require('@images/new/down.png')}
                      width={13}
                    />
                  </View>
                </TouchableOpacity>
              )}
              {this.state.valueSelect == 'anatomy' ? (
                this.state.currentGroup && this.state.currentGroup.length ? (
                  this.state.currentGroup.map((obj, i) => {
                    return <View key={i}>{this.renderAtomy(obj)}</View>;
                  })
                ) : null
              ) : (
                <View>
                  <Table>
                    <Row
                      data={this.state.tableHead}
                      style={styles.head}
                      textStyle={styles.text}
                      flexArr={[4, 1]}
                    />
                    {this.state.currentGroup && this.state.currentGroup.length
                      ? this.state.currentGroup.map((obj, i) => {
                          return (
                            <View key={i}>
                              {!obj?.isNotChild ? (
                                <Text
                                  style={[
                                    styles.groupName,
                                    {
                                      marginLeft: 10,
                                      color: '#000000',
                                      marginVertical: 5,
                                      fontSize: 14,
                                    },
                                  ]}>
                                  {obj?.serviceName?.toUpperCase()}
                                </Text>
                              ) : (
                                <View />
                              )}
                              {obj.lines
                                .filter(
                                  obj =>
                                    obj.result ||
                                    obj.normalRange ||
                                    obj.resultState ||
                                    obj.conclusion ||
                                    obj.higherIndicator ||
                                    obj.lowerIndicator,
                                )
                                .map((data, i) => this.renderMedical(data, i))}
                            </View>
                          );
                        })
                      : null}
                  </Table>
                </View>
              )}
            </View>
          ) : null}
        </Card>
        <ActionSheet
          ref={o => (this.actionSheetChooseType = o)}
          options={this.state.actions}
          cancelButtonIndex={this.state.actions.length - 1}
          destructiveButtonIndex={this.state.actions.length - 1}
          onPress={index => this.onSelect(index, medicalTest)}
        />
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
    padding: 10,
  },
  containerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
  },
  containerDescription: {
    backgroundColor: '#ffffff',
    // shadowColor: "rgba(0, 0, 0, 0.05)",
    // shadowOffset: {
    //     width: 0,
    //     height: 2
    // },
    // shadowRadius: 10,
    // shadowOpacity: 1,
    // elevation: 3,
    borderRadius: 5,
    padding: 10,
  },
  containerValue: {
    backgroundColor: '#DFF5F2',
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: '#111',
  },
  flex: {flex: 1},
  LineCell: {
    borderLeftWidth: 0,
    flex: 4,
    alignItems: 'flex-start',
    padding: 5,
    width: '100%',
  },
  center: {alignItems: 'center', justifyContent: 'center'},
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
  head: {
    backgroundColor: '#166950',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    paddingVertical: 10,
  },
  text: {
    textAlign: 'left',
    fontSize: 14,
    width: '100%',
    flex: 1,
    color: '#FFF',
    fontWeight: 'bold',
  },
  textValue: {
    fontSize: 14,
    textAlign: 'left',
  },
  diagnosticLabel: {
    color: constants.colors.primary_bold,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  groupSelected: {
    color: constants.colors.primary_bold,
  },
  cellStyle: {backgroundColor: '#DFF5F2'},
  tableWrappe: {flexDirection: 'row'},
  viewCurrentGroup: {alignItems: 'flex-end', marginVertical: 10},
  btnCurrentGroup: {flexDirection: 'row', alignItems: 'center'},
  txCurrent: {marginRight: 10},
  viewType: {
    marginVertical: 10,
    justifyContent: 'flex-start',
    backgroundColor: '#0291E120',
    flex: 1,
    padding: 10,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  tableWrapper: {flexDirection: 'row', padding: 5},
  groupName: {color: '#0291E1', fontSize: 14, fontWeight: 'bold', width: '90%'},
  result: {
    padding: 10,
  },
});
export default connect(mapStateToProps)(MedicalTestResult);
