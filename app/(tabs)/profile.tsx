import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Switch,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications'; 

// Feather icon components with proper TypeScript types
interface IconProps {
  color: string;
  size: number;
}

const User: React.FC<IconProps> = ({ color, size }) => <Feather name="user" size={size} color={color} />;
const Settings: React.FC<IconProps> = ({ color, size }) => <Feather name="settings" size={size} color={color} />;
const Bell: React.FC<IconProps> = ({ color, size }) => <Feather name="bell" size={size} color={color} />;
const Shield: React.FC<IconProps> = ({ color, size }) => <Feather name="shield" size={size} color={color} />;
const HelpCircle: React.FC<IconProps> = ({ color, size }) => <Feather name="help-circle" size={size} color={color} />;
const LogOut: React.FC<IconProps> = ({ color, size }) => <Feather name="log-out" size={size} color={color} />;
const Camera: React.FC<IconProps> = ({ color, size }) => <Feather name="camera" size={size} color={color} />;
const Moon: React.FC<IconProps> = ({ color, size }) => <Feather name="moon" size={size} color={color} />;
const Monitor: React.FC<IconProps> = ({ color, size }) => <Feather name="monitor" size={size} color={color} />;
const Users: React.FC<IconProps> = ({ color, size }) => <Feather name="users" size={size} color={color} />;
const Crown: React.FC<IconProps> = ({ color, size }) => <Feather name="award" size={size} color={color} />;
const ChevronRight: React.FC<IconProps> = ({ color, size }) => <Feather name="chevron-right" size={size} color={color} />;

// Settings item types
interface BaseSettingsItem {
  icon: React.FC<IconProps>;
  label: string;
}

interface ActionSettingsItem extends BaseSettingsItem {
  onPress: () => void;
  premium?: boolean;
  danger?: boolean;
  dev?: boolean;
}

interface ToggleSettingsItem extends BaseSettingsItem {
  toggle: true;
  value: boolean;
  onToggle: () => void;
}

type SettingsItem = ActionSettingsItem | ToggleSettingsItem;

import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import GuestBanner from '@/components/GuestBanner';
import EditProfileModal from '@/components/EditProfileModal';
import { useTabBarScroll } from './_layout';

// Utility to clear async storage (cache)
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { colors, theme, toggleTheme } = useTheme();
  const { onScroll } = useTabBarScroll();
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // Handle notification permission and toggle
  const handleToggleNotifications = async () => {
    if (!notificationsEnabled) {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status === 'granted') {
        setNotificationsEnabled(true);
        Alert.alert('Notifications enabled!');
      } else {
        setNotificationsEnabled(false);
        Alert.alert('Permission denied', 'Enable notifications in your device settings.');
      }
    } else {
      setNotificationsEnabled(false);
    }
  };

  // Handle logout and redirect to login, clear cache
  const handleLogout = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Sign Out", style: "destructive", onPress: async () => {
            await logout();
            await AsyncStorage.clear();
            router.replace('/auth/login');
          }
        }
      ]
    );
  };

  // Settings groups with titles
  const settingsGroups: { title: string; items: SettingsItem[] }[] = [
    {
      title: "Account",
      items: [
        { icon: User, label: "Edit Profile", onPress: () => setShowEditProfile(true) },
        { icon: Crown, label: "Upgrade to Premium", onPress: () => {}, premium: true },
      ]
    },
    {
      title: "Preferences",
      items: [
        { icon: Bell, label: "Notifications", toggle: true, value: notificationsEnabled, onToggle: handleToggleNotifications },
        { icon: Moon, label: "Dark Mode", toggle: true, value: theme === 'dark', onToggle: toggleTheme },
      ]
    },
    {
      title: "Support",
      items: [
        { icon: HelpCircle, label: "Help Center", onPress: () => {} },
        { icon: Settings, label: "App Settings", onPress: () => {} },
        { icon: LogOut, label: "Sign Out", onPress: handleLogout, danger: true },
      ]
    }
  ];

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]} 
      showsVerticalScrollIndicator={false}
      onScroll={onScroll}
      scrollEventThrottle={16}
    >
      <LinearGradient
        colors={[colors.surface, colors.charcoal, colors.deepNavy]}
        style={styles.header,{ borderRadius: 30 }}
      >
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: colors.overlayLight, borderColor: colors.primary }]}>
              <Text style={[styles.avatarText, {color: colors.primary }]}>
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </Text>
            </View>
            <View style={[styles.statusIndicator, { backgroundColor: colors.success, borderColor: colors.surface }]} />
          </View>
          <Text style={[styles.userName, { color: colors.primary }]}>
            {user?.firstName} {user?.lastName}
          </Text>
            {!user?.isGuest && (
            <Text style={[styles.userEmail, { color: colors.primary }]}>{user?.email}</Text>
            )}
            {user?.isGuest && (
            <Text style={[styles.guestLabel, { color: colors.warning }]}>Guest User</Text>
            )}
            <View style={[styles.levelContainer, { backgroundColor: 'transparent' }]}>
            <Text style={[styles.levelText, { color: colors.transparent }]}>Level 12 • Learning Explorer</Text>
            </View>
        </View>

        <View style={[styles.statsRow, { backgroundColor: 'transparent' }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.text }]}>127</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Problems Solved</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: 'rgba(255,255,255,0.15)' }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.text }]}>23</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Topics Learned</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.overlayLight }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.text }]}>38</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Challenges Solved</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {user?.isGuest && <GuestBanner />}

        {/* Render settings items grouped by section title */}
        {settingsGroups.map((group, groupIdx) => (
          <View key={group.title} style={{ marginBottom: 32 }}>
            <Text style={[styles.groupTitle, { color: colors.textSecondary }]}>{group.title}</Text>
            {group.items.map((item, idx) => (
              <TouchableOpacity
                key={item.label}
                style={[
                  styles.settingsItem,
                  {
                    backgroundColor: colors.background === '#121212'
                      ? '#000000'
                      : '#fff',
                    shadowColor: colors.background === '#121212'
                      ? '#fff'
                      : '#000',
                  },
                  idx === group.items.length - 1 && styles.lastItem,
                ]}
                onPress={'onPress' in item ? item.onPress : undefined}
                disabled={'toggle' in item}
                activeOpacity={0.85}
              >
                <View style={styles.settingsItemLeft}>
                  <View style={[
                    styles.settingsIcon,
                    { backgroundColor: colors.surfaceSecondary },
                    'danger' in item && item.danger && { backgroundColor: colors.error + '20' },
                    'premium' in item && item.premium && { backgroundColor: colors.warning + '20' }
                  ]}>
                    <item.icon 
                      size={20} 
                      color={
                        'danger' in item && item.danger ? colors.error : 
                        'premium' in item && item.premium ? colors.warning : 
                        colors.textSecondary
                      } 
                    />
                  </View>
                  <Text style={[
                    styles.settingsLabel,
                    { color: colors.text },
                    'danger' in item && item.danger && { color: colors.error },
                    'premium' in item && item.premium && { color: colors.warning },
                    'dev' in item && item.dev && { color: colors.primary }
                  ]}>
                    {item.label}
                  </Text>
                </View>
                {'toggle' in item ? (
                  <Switch
                    value={item.value}
                    onValueChange={item.onToggle}
                    trackColor={{ false: colors.border, true: colors.primary }}
                    thumbColor={item.value ? '#FFF' : '#FFF'}
                  />
                ) : (
                  <ChevronRight size={16} color={colors.textTertiary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}

        <View style={styles.footerSection}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>Luminara Learn v1.0.0</Text>
          <Text style={[styles.footerSubtext, { color: colors.textTertiary }]}>
            Illuminating the path to understanding
          </Text>
        </View>
      </View>

      {/* Edit Profile Modal */}
      <EditProfileModal
        visible={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        onSave={async (data) => {
          try {
            await updateProfile(data);
            setShowEditProfile(false);
          } catch (error) {
            console.log(error);
          }
        }}
        initialData={{
          firstName: user?.firstName || '',
          secondName: user?.lastName || '',
          thirdName: '',
          username: user?.email?.split('@')[0] || '',
          age: '',
          country: '',
          languages: [],
          location: '',
          school: '',
          educationLevel: '',
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
    marginTop: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    marginTop: 20,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    marginBottom: 12,
  },
  guestLabel: {
    fontSize: 16,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  levelContainer: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  levelText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 30,
  },
  content: {
    padding: 20,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    marginLeft: 4,
    opacity: 0.85,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 0,
    marginBottom: 16,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#d9c4b0', 
    shadowRadius: 12,
    elevation: 4,
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingsIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingsLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  footerSection: {
    alignItems: 'center',
    marginTop: 20,
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 14,
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    fontStyle: 'italic',
  },
});