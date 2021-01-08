import React, {memo} from 'react';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  renderers,
} from 'react-native-popup-menu';
import {View, Text, StyleSheet} from 'react-native';
const {Popover, ContextMenu, NotAnimatedContextMenu, SlideInMenu} = renderers;

const CustomMenu = ({
  MenuSelectOption,
  options,
  customOption,
  onSelected,
  textStyle,
  ...props
}) => {
  const onSelect = (e, i) => () => {
    onSelected(e, i);
  };
  return (
    <Menu
      {...props}
      renderer={Popover}
      rendererProps={{
        placement: 'bottom',
        anchorStyle: {backgroundColor: '#00CBA7'},
      }}>
      <MenuTrigger>{MenuSelectOption}</MenuTrigger>
      <MenuOptions>
        {customOption
          ? customOption
          : options?.length
          ? options.map((e, i) => {
              return (
                <MenuOption
                  key={i}
                  style={styles.containerOption}
                  onSelect={onSelect(e, i)}>
                  <View style={[styles.buttonAnwser]}>
                    <Text style={{color:`${e.color || '#000000'}`}}>{e.value}</Text>
                  </View>
                </MenuOption>
              );
            })
          : null}
      </MenuOptions>
    </Menu>
  );
};

const styles = StyleSheet.create({
  containerOption: {
    borderBottomColor: '#00000020',
    borderBottomWidth: 1,
  },
  buttonAnwser: {
    // alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
});
export default memo(CustomMenu);
