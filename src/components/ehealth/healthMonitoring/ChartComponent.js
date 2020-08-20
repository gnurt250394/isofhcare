import React from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Button,
  View,
  processColor,
  ScrollView,
} from 'react-native';
import update from 'immutability-helper';

import {LineChart} from 'react-native-charts-wrapper';

const distanceToLoadMore = 10;
const pageSize = 10;
class ChartComponent extends React.Component {
  constructor(props) {
    super(props);

    this.isLoading = false;
    this.xMin = 6;
    this.xMax = 7;
    this.page = this.props.page;
    this.size = (this.props.page + 1) * this.xMax;

    this.state = {
      data: {},
      xAxis: {
        granularityEnabled: true,
        granularity: 1,
        // axisLineWidth: 3,
        position: 'BOTTOM',
        labelCount: 6,
        avoidFirstLastClipping: true,
      },
    };
  }

  componentDidMount() {
    let newState = update(this.state, {
      data: {
        $set: {
          dataSets: this.getDataChart(this.props.data),
        },
      },
    });
    this.setState(newState, () => {
      this.refs.chart.moveViewToX(9);
    });
    this.setState({
      visibleRange: {x: {min: this.xMin, max: this.xMax}},
    });
    this.setState({
      xAxis: {...this.state.xAxis, valueFormatter: this.props.time},
    });
  }

  getDataChart = (dataCharts = []) => {
    let data = dataCharts.map((e, i) => {
      return {
        values: e.values,
        label: e.label || 'label',
        config: {
          color: processColor(e.color),
          drawCircles: true,
          lineWidth: 3,
          drawValues: false,
          axisDependency: 'LEFT',
          circleColor: processColor('#00AA63'),
          circleRadius: 3,
          drawCircleHole: false,
          mode: 'HORIZONTAL_BEZIER',
        },
      };
    });

    return data;
  };
  componentWillReceiveProps = preProps => {
    console.log('preProps: ', preProps);
    this.page = preProps.page;
    this.size = (preProps.page + 1) * this.xMax;
    if (this.props.data != preProps.data) {
      let newState = update(this.state, {
        data: {
          $set: {
            dataSets: this.getDataChart(preProps.data),
          },
        },
      });
      this.setState(newState, () => {
        this.refs.chart.moveViewToX(2);
      });
    }
    if (this.props.time != preProps.time) {
      this.setState(pre => ({
        xAxis: {
          ...this.state.xAxis,
          valueFormatter: preProps.time,
        },
      }));
    }
  };

  handleChange = event => {
    let nativeEvent = event.nativeEvent;

    if (nativeEvent.action == 'chartTranslated') {
      let {left, right, centerX} = nativeEvent;

      console.log(
        'data is from ' +
          this.xMin +
          ' to ' +
          this.xMax +
          ' left ' +
          left +
          ' right ' +
          right +
          ' isLoading ' +
          this.isLoading,
      );
      if (!this.isLoading) {
        if (left < 2) {
          this.isLoading = true;

          if (this.timeout) clearTimeout(this.timeout);
          this.timeout = setTimeout(() => {
            this.props.loadMore && this.props.loadMore();
            this.isLoading = false;
          }, 500);

          // Because of the implementation of MpAndroidChart, if the action of setDataAndLockIndex is triggered by user dragging,
          // then the size of new data should be equal to original data, otherwise the calculation of position transition won't be accurate,
          // use may find the chart suddenly blink to another position.
          // This restriction only exists in android, in iOS, we have no such problem.
          // this.mockLoadDataFromServer(
          //   centerX - pageSize,
          //   centerX + pageSize,
          // ).then(data => {
          //   this.refs.chart.setDataAndLockIndex(data);

          //   this.isLoading = false;
          // });
        }
      }
    }
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={styles.container}>
          <LineChart
            style={styles.chart}
            data={this.state.data}
            xAxis={this.state.xAxis}
            // highlights={[{x: 3}, {x: 6}]}
            animation={{
              durationY: 1000,
            }}
            chartDescription={{
              text: '',
            }}
            yAxis={{
              left:{
                // valueFormatter: 'largeValue',
                // axisMinimum: 10,
                // drawAxisLine: false,
                // gridDashedLine: {
                //   lineLength: 5,
                //   spaceLength: 5,
                // },
              },
              right: {
                inverted:true,
                enabled: false,
              },
            }}
            touchEnabled={true}
            dragEnabled={true}
            scaleEnabled={true}
            syncX={true}
            scaleXEnabled={true}
            legend={{
              form: 'LINE',
              horizontalAlignment: 'CENTER',
              orientation: 'HORIZONTAL',
              wordWrapEnabled: true,
              xEntrySpace: 20,
              formSize: 20,
              textSize: 13,
            }}
            marker={{
              enabled: true,
              markerColor: processColor('#372B7B'),
              textColor: processColor('#FFF'),
              markerFontSize: 14,
            }}
            scaleYEnabled={true}
            visibleRange={this.state.visibleRange}
            dragDecelerationEnabled={false}
            ref="chart"
            onChange={this.handleChange.bind(this)}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  chart: {
    flex: 1,
    height: 300,
  },
});

export default ChartComponent;
