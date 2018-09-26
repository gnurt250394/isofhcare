import React, { Component, PropTypes } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { connect } from 'react-redux';
import ScaleImage from 'mainam-react-native-scaleimage';

class Rating extends Component {
    constructor(props) {
        super(props)
        this.state = {
            count: 5, value: 0, margin: 0, width: 20,
            counts: [0, 0, 0, 0, 0]
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }
    componentWillReceiveProps() {
        this.initData();
    }
    setCurrentRating(value) {
        let counts = this.getCount(this.state.count, value);
        this.setState({ value, counts });
    }
    getCurrentRating() {
        return this.state.value;
    }

    onPress(index) {
        if (!this.props.readonly) {
            let counts = this.getCount(this.state.count, index + 1);
            this.setState({ value: index + 1, counts });
        }
    }
    componentDidMount() {
        this.initData();
    }
    getCount(count, value) {
        let counts = [];
        for (var i = 0; i < count; i++) {

            if (i + 1 <= value) {
                counts.push(1);
            }
            else {
                if (i + 1 - value >= 1)
                    counts.push(0);
                else
                    if (i + 1 - value >= 0.75) {
                        counts.push(1);
                    }
                    else {
                        if (i + 1 - value < 0.75 && i + 1 - value >= 0.25) {
                            counts.push(0.5);
                        }
                        else
                            counts.push(0);
                    }
            }
        }
        return counts;
    }
    initData() {
        let count = this.props.count;
        if (!count)
            count = 5;
        let value = this.props.value;
        if (!value || value > count)
            value = 0;

        let counts = this.getCount(count, value);

        let width = this.props.starWidth;
        if (!width)
            width = 20;
        let margin = this.props.starMargin;
        if (!margin)
            margin = 0;
        this.setState({
            counts, count, value, margin, width
        });
    }
    render() {


        return (
            <View style={[{ flexDirection: 'row' }, this.props.style]}>
                {
                    this.state.counts.map((item, index) => <TouchableOpacity key={index} disabled={this.props.readonly}
                        style={[this.props.style]} onPress={this.onPress.bind(this, index)}>
                        {
                            item == 1 ?
                                <Image source={require("@images/star1.png")} style={{ width: this.state.width, height: this.state.width, margin: this.state.margin }} />
                                :
                                item == 0 ?
                                    <Image source={require("@images/star0.png")} style={{ width: this.state.width, height: this.state.width, margin: this.state.margin }} />
                                    :
                                    <Image source={require("@images/star05.png")} style={{ width: this.state.width, height: this.state.width, margin: this.state.margin }} />
                        }
                    </TouchableOpacity>
                    )
                }
            </View>
        )

    }
}
export default Rating;