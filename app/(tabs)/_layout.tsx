import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { useRef, useEffect, createContext, useContext } from 'react';
import { Animated, View } from 'react-native';

// Create context for scroll handling
const TabBarContext = createContext<{
  onScroll: (event: any) => void;
} | null>(null);

export const useTabBarScroll = () => {
  const context = useContext(TabBarContext);
  if (!context) {
    throw new Error('useTabBarScroll must be used within TabBarContext');
  }
  return context;
};

function TabLayout() {
  const insets = useSafeAreaInsets();
  
  // Animation values
  const tabBarTranslateY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);
  const scrollDirection = useRef<'up' | 'down'>('up');
  
  // Scroll handler
  const handleScroll = (event: any) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    const scrollDiff = currentScrollY - lastScrollY.current;
    
    // Determine scroll direction with threshold to prevent jittery behavior
    if (Math.abs(scrollDiff) > 5) {
      const newDirection = scrollDiff > 0 ? 'down' : 'up';
      
      if (newDirection !== scrollDirection.current) {
        scrollDirection.current = newDirection;
        
        // Animate tab bar
        Animated.timing(tabBarTranslateY, {
          toValue: newDirection === 'down' ? 100 : 0, // Adjust based on your tab bar height
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
    }
    
    lastScrollY.current = currentScrollY;
  };
  
  return (
    <TabBarContext.Provider value={{ onScroll: handleScroll }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: 'transparent',
            borderTopWidth: 0,
            paddingBottom: 28,
            paddingTop: 12,
            paddingHorizontal: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -8 },
            shadowOpacity: 0.25,
            shadowRadius: 12,
            elevation: 20,
            position: 'absolute',
            borderTopColor: 'rgba(255, 255, 255, 0.05)',
            borderTopWidth: 1,
            height: 70 + insets.bottom,
            paddingBottom: insets.bottom,
            // Add the animation transform
            transform: [{ translateY: tabBarTranslateY }],
          },
          tabBarActiveTintColor: '#E6B84D',
          tabBarInactiveTintColor: '#B3B3B3',
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            marginTop: 6,
            letterSpacing: 0.3,
          },
          tabBarIconStyle: {
            marginBottom: 0,
          },
          tabBarItemStyle: {
            paddingVertical: 4,
          },
          tabBarHideOnKeyboard: true,
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ size, color }: { size: number; color: string }) => (
              <Feather name="home" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="learn"
          options={{
            title: 'Learn',
            tabBarIcon: ({ size, color }: { size: number; color: string }) => (
              <Feather name="book-open" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="progress"
          options={{
            title: 'Progress',
            tabBarIcon: ({ size, color }: { size: number; color: string }) => (
              <Feather name="trending-up" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ size, color }: { size: number; color: string }) => (
              <Feather name="user" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </TabBarContext.Provider>
  );
}

export default TabLayout;