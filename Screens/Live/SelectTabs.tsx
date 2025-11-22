import {StyleSheet, Text, View} from 'react-native';
import React, { JSX } from 'react';
import {AppView} from '@/components';

interface SelectTabs {
  tabs: {
    tab: string;
    element: JSX.Element;
  }[];
  selectedTab: string;
}

const SelectTabs = ({tabs, selectedTab}: SelectTabs) => {
  return (
    <>
      {tabs.map((tab, i) => {
        return (
          <AppView key={i}>{tab.tab === selectedTab && tab.element}</AppView>
        );
      })}
    </>
  );
};

export default SelectTabs;
