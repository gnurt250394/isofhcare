import React, { Component, PropTypes } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import ScaleImage from 'mainam-react-native-scaleimage';

class RadioButton extends Component {
    constructor(props) {
        super(props)
        this.state = {
            checked: this.props.checked
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.width != this.state.width
            || nextProps.height != this.state.height
            || nextProps.checked != this.state.checked
            || nextProps.uncheckImage != this.props.uncheckImage
            || nextProps.checkedImage != this.props.checkedImage)
            return true;
        return fail;
    }

    onPress() {
        this.setState({ checked: !this.state.checked });
    }
    render() {
        if (this.props.uncheckImage && this.props.checkedImage) {
            return (
                <TouchableOpacity style={[this.props.style]} onPress={this.onPress.bind(this)}>
                    {
                        this.state.checked ?
                            <ScaleImage source={this.props.checkedImage} width={this.props.width} height={this.props.height} /> :
                            <ScaleImage source={this.props.uncheckImage} width={this.props.width} height={this.props.height} />
                    }
                </TouchableOpacity>
            )
        }
        return null;
    }
}
export default RadioButton;