import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import dateUtils from 'mainam-react-native-date-utils';
import EhealthItem from '@components/ehealth/EhealthItem';
import { Card } from 'native-base';
import ScaledImage from 'mainam-react-native-scaleimage';
import { isArray } from 'lodash';
import { Table, Row, Cell, TableWrapper } from 'react-native-table-component';

class MedicalSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listTime: [],
      isShow: false,
    };
  }

  onSetShow = () => {
    this.setState({ isShow: !this.state.isShow });
  };
  renderMedicalSummary = data => {
    return data
      .sort((a, b) => a.ordinal - b.ordinal)
      .map((item, index) => {
        let data2 = [item.title, item.result];
        return (
          <TableWrapper
            key={index}
            style={[
              index % 2 == 0
                ? { backgroundColor: '#fff' }
                : { backgroundColor: '#f5f5f5' },
              { flex: 1, flexDirection: 'row' },
            ]}>
            <Cell
              data={item.title}
              style={[styles.LineCell, { justifyContent: 'flex-start' }]}
            />
            <Cell data={item.result} style={[styles.LineCell]} />
          </TableWrapper>
        );
      });
  };
  render() {
    let summary = this.props.summary;

    if (!summary) {
      return null;
    }

    return (
      <View style={styles.container}>
        <Card style={styles.card}>
          <TouchableOpacity
            onPress={this.onSetShow}
            style={[
              styles.buttonShowInfo,
              this.state.isShow ? { backgroundColor: '#3161AD' } : {},
            ]}>
            <ScaledImage
              source={require('@images/new/ehealth/ic_summary.png')}
              height={19}
              style={{
                tintColor: this.state.isShow ? '#FFF' : '#3161AD',
              }}
            />
            <Text
              style={[
                styles.txtTitle,
                this.state.isShow ? { color: '#FFF' } : {},
              ]}>
              TÓM TẮT BỆNH ÁN
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
                    transform: [{ rotate: '-90deg' }],
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
              {summary.summary?.length
                ? summary.summary
                  ?.sort((a, b) => a.ordinal - b.ordinal)
                  .map((e, i) => {
                    if (!Object.keys(e).length) return null;
                    return (
                      <View key={i}>
                        <Text style={styles.txtTitle2}>
                          {e.ordinal}. {e.title}
                        </Text>
                        {isArray(e.result) ? (
                          <Table
                            borderStyle={{
                              borderWidth: 1,
                              borderColor: '#00000060',
                            }}
                            style={[{ marginTop: 10, flex: 1 }]}>
                            {this.renderMedicalSummary(e.result)}
                          </Table>
                        ) : (
                            <Text style={{}}>{e.result}</Text>
                          )}
                      </View>
                    );
                  })
                : null}
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
  LineCell: {
    flex: 1,
    padding: 5,
  },
  text: { padding: 4, textAlign: 'left' },
  line: {
    height: '100%',
    width: 1,
    backgroundColor: '#00000060',
  },
  txtResult: {
    paddingVertical: 5,
    paddingHorizontal: 5,
    flex: 1,
    borderLeftWidth: 1,
    borderLeftColor: '#00000060',
    textAlign: 'right',
  },
  txtLabel: {
    flex: 1,
    paddingHorizontal: 5,
    paddingVertical: 5,
    paddingRight: 15,
  },
  containerItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    borderBottomWidth: 1,
    borderColor: '#00000060',
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  txtTitle2: {
    color: '#0291E1',
    fontSize: 16,
    fontWeight: 'bold',
    paddingBottom: 5,
    paddingTop: 10,
  },
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
  round2: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#7daa3c' },
  round3: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#c74444' },
  itemlabel: { marginLeft: 5, flex: 1, marginTop: 2 },
  itemcontent: { color: '#0291E1' },
  item: { marginTop: 10, flexDirection: 'row' },
  txCheckUp: { fontWeight: 'bold', fontSize: 18 },
});
export default connect(mapStateToProps)(MedicalSummary);
