import React from "react";
import { Dashboard } from "../screens/Dashboard";
import { AddChat } from "../screens/AddChat";
import { createDrawerNavigator } from "@react-navigation/drawer";

const DrawerNavigator = () => {
  const Drawer = createDrawerNavigator();

  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Dashboard" component={Dashboard}/>
      <Drawer.Screen name="AddChat" component={AddChat} />
    </Drawer.Navigator>
  );
};

export { DrawerNavigator };
