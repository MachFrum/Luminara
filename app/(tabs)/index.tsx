
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
  RefreshControl,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import GuestBanner from '@/components/GuestBanner';
import { supabase } from '@/lib/supabase';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useTabBarScroll } from './_layout';

const { width } = Dimensions.get('window');

// Feather icon components with proper TypeScript types
interface IconProps {
  color: string;
  size: number;
}

const BookOpen: React.FC<IconProps> = ({ color, size }) => <Feather name="book-open" size={size} color={color} />;
const TrendingUp: React.FC<IconProps> = ({ color, size }) => <Feather name="trending-up" size={size} color={color} />;
const Target: React.FC<IconProps> = ({ color, size }) => <Feather name="target" size={size} color={color} />;
const Clock: React.FC<IconProps> = ({ color, size }) => <Feather name="clock" size={size} color={color} />;
const Star: React.FC<IconProps> = ({ color, size }) => <Feather name="star" size={size} color={color} />;
const Flame: React.FC<IconProps> = ({ color, size }) => <Feather name="zap" size={size} color={color} />;
const Trophy: React.FC<IconProps> = ({ color, size }) => <Feather name="award" size={size} color={color} />;
const ChevronRight: React.FC<IconProps> = ({ color, size }) => <Feather name="chevron-right" size={size} color={color} />;
const Zap: React.FC<IconProps> = ({ color, size }) => <Feather name="zap" size={size} color={color} />;
const Brain: React.FC<IconProps> = ({ color, size }) => <Feather name="cpu" size={size} color={color} />;
const Users: React.FC<IconProps> = ({ color, size }) => <Feather name="users" size={size} color={color} />;
const Award: React.FC<IconProps> = ({ color, size }) => <Feather name="award" size={size} color={color} />;
const Plus: React.FC<IconProps> = ({ color, size }) => <Feather name="plus" size={size} color={color} />;

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.FC<IconProps>;
  color: string;
  route: string;
}

interface RecentActivity {
  id: string;
  title: string;
  subject: string;
  timeAgo: string;
  difficulty: 'easy' | 'medium' | 'hard';
  imageUrl: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.FC<IconProps>;
  color: string;
  progress: number;
  maxProgress: number;
}

export default function HomeScreen() {
  const { user } = useAuth();
  const { colors, typography, spacing } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const router = useRouter();
  const { onScroll } = useTabBarScroll();

  // Initialize animations
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const quickActions: QuickAction[] = [
    {
      id: '1',
      title: 'Start Learning',
      description: 'Ask a question or solve a problem.',
      icon: Brain,
      color: colors.accent,
      route: '/learn',
    },
    {
      id: '2',
      title: 'View Progress',
      description: 'Track your learning journey.',
      icon: TrendingUp,
      color: colors.accent,
      route: '/progress',
    },
    {
      id: '3',
      title: 'Challenges',
      description: 'Tackle challenging questions.',
      icon: Plus,
      color: colors.accent,
      route: '/groups',
    },
    {
      id: '4',
      title: 'Achievements',
      description: 'View your achievements.',
      icon: Award,
      color: colors.accent,
      route: '/achievements',
    },
  ];

  const recentActivities: RecentActivity[] = [
    {
      id: '1',
      title: 'Quadratic Equations',
      subject: 'Mathematics',
      timeAgo: '2 hours ago',
      difficulty: 'medium',
      imageUrl: 'https://images.pexels.com/photos/6238297/pexels-photo-6238297.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    },
    {
      id: '2',
      title: 'Photosynthesis Process',
      subject: 'Biology',
      timeAgo: '1 day ago',
      difficulty: 'easy',
      imageUrl: 'https://images.pexels.com/photos/1072179/pexels-photo-1072179.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    },
    {
      id: '3',
      title: "Newton's Laws",
      subject: 'Physics',
      timeAgo: '2 days ago',
      difficulty: 'hard',
      imageUrl: 'https://images.pexels.com/photos/355952/pexels-photo-355952.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    },
  ];

  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'Problem Solver',
      description: 'Solve 50 problems',
      icon: Target,
      color: colors.accent,
      progress: 35,
      maxProgress: 50,
    },
    {
      id: '2',
      title: 'Streak Master',
      description: '7 day learning streak',
      icon: Flame,
      color: colors.accent,
      progress: 7,
      maxProgress: 7,
    },
    {
      id: '3',
      title: 'Quick Learner',
      description: 'Complete 5 topics',
      icon: Zap,
      color: colors.accent,
      progress: 3,
      maxProgress: 5,
    },
  ];

  const onRefresh = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setRefreshing(true);
    setRefreshing(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return colors.accent;
      case 'medium': return colors.textSecondary;
      case 'hard': return colors.error;
      default: return colors.textSecondary;
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const openAchievementsModalOnProgress = () => {
    // Use router.push with a query param or state to signal opening the modal
    router.push({ pathname: '/progress', params: { showAchievements: '1' } });
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.accent}
          colors={[colors.accent]}
        />
      }
      onScroll={onScroll}
      scrollEventThrottle={16}
    >
      {/* Header */}
      <BlurView intensity={80} tint={colors.background === '#121212' ? 'dark' : 'light'} style={styles.header}>
        <Animated.View
          style={[
            styles.headerContent,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.welcomeSection}>
            <Text style={[styles.greeting, { color: colors.textSecondary, ...typography.caption }]}>
              {getGreeting()}, {user?.firstName || 'Learner'} 👋
            </Text>
            <Text style={[styles.welcomeTitle, { color: colors.primary, ...typography.h1 }]}>
              Ready to learn something new?
            </Text>
          </View>

          {/* Stats Overview */}
          <BlurView intensity={90} tint={colors.background === '#121212' ? 'dark' : 'light'} style={styles.statsContainer}>
            <View style={styles.statItem}>
              <BookOpen size={20} color={colors.accent} />
              <Text style={[styles.statNumber, { color: colors.primary, ...typography.h2 }]}>127</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary, ...typography.caption }]}>Problems</Text>
            </View>
            
            <View style={[styles.statDivider, { backgroundColor: colors.textSecondary }]} />
            
            <View style={styles.statItem}>
              <Clock size={20} color={colors.accent} />
              <Text style={[styles.statNumber, { color: colors.primary, ...typography.h2 }]}>42</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary, ...typography.caption }]}>Hours</Text>
            </View>
            
            <View style={[styles.statDivider, { backgroundColor: colors.textSecondary }]} />
            
            <View style={styles.statItem}>
              <Flame size={20} color={colors.error} />
              <Text style={[styles.statNumber, { color: colors.primary, ...typography.h2 }]}>7</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary, ...typography.caption }]}>Day Streak</Text>
            </View>
          </BlurView>
        </Animated.View>
      </BlurView>

      <View style={styles.content}>
        {/* Guest Banner */}
        {user?.isGuest && <GuestBanner />}

        {/* Quick Actions */}
        <Animated.View
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.primary, ...typography.h2 }]}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={action.id}
                style={styles.quickActionCard}
                activeOpacity={0.8}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  if (index === 0) {
                    router.push('/learn');
                  } else if (index === 1) {
                    router.push('/progress');
                  } else if (action.title === 'Achievements') {
                    openAchievementsModalOnProgress();
                  }
                }}
              >
                <BlurView intensity={80} tint={colors.background === '#121212' ? 'dark' : 'light'} style={styles.quickActionBlur}>
                  <View style={[styles.quickActionIcon, { backgroundColor: colors.surface }]}>
                    <action.icon size={24} color={action.color} />
                  </View>
                  <Text style={[styles.quickActionTitle, { color: colors.primary, ...typography.body }]}>{action.title}</Text>
                  <Text style={[styles.quickActionDescription, { color: colors.textSecondary, ...typography.caption }]}>
                    {action.description}
                  </Text>
                </BlurView>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Recent Activity */}
        <Animated.View
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.primary, ...typography.h2 }]}>Recent Activity</Text>
          </View>
          
          {recentActivities.map((activity) => (
            <TouchableOpacity
              key={activity.id}
              style={styles.activityCard}
              activeOpacity={0.8}
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            >
              <BlurView
                style={styles.activityBlur}
                intensity={80}
                tint={colors.background === '#121212' ? 'dark' : 'light'}
              >
                <Image source={{ uri: activity.imageUrl }} style={styles.activityImage} />
                <View style={styles.activityContent}>
                  <Text style={[styles.activityTitle, { color: colors.primary, ...typography.body }]}>{activity.title}</Text>
                  <Text style={[styles.activitySubject, { color: colors.accent, ...typography.caption }]}>{activity.subject}</Text>
                  <View style={styles.activityMeta}>
                    <Text style={[styles.activityTime, { color: colors.textSecondary, ...typography.caption }]}>{activity.timeAgo}</Text>
                    <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(activity.difficulty) }]}>
                      <Text style={[styles.difficultyText, { color: colors.primary, ...typography.caption }]}>
                        {activity.difficulty}
                      </Text>
                    </View>
                  </View>
                </View>
                <ChevronRight size={20} color={colors.textSecondary} />
              </BlurView>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Achievements Progress */}
        <Animated.View
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.primary, ...typography.h2 }]}>Recent Achievements</Text>
          </View>
          
          {achievements.map((achievement) => (
            <View
              key={achievement.id}
              style={styles.achievementCard}
            >
              <BlurView
                style={styles.achievementBlur}
                intensity={80}
                tint={colors.background === '#121212' ? 'dark' : 'light'}
              >
                <View style={[styles.achievementIcon, { backgroundColor: colors.surface }]}>
                  <achievement.icon size={24} color={colors.accent} />
                </View>
                <View style={styles.achievementContent}>
                  <Text style={[styles.achievementTitle, { color: colors.primary, ...typography.body }]}>{achievement.title}</Text>
                  <Text style={[styles.achievementDescription, { color: colors.textSecondary, ...typography.caption }]}>
                    {achievement.description}
                  </Text>
                  <View style={styles.progressContainer}>
                    <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width: `${(achievement.progress / achievement.maxProgress) * 100}%`,
                            backgroundColor: colors.accent,
                          },
                        ]}
                      />
                    </View>
                    <Text style={[styles.progressText, { color: colors.textSecondary, ...typography.caption }]}>
                      {achievement.progress}/{achievement.maxProgress}
                    </Text>
                  </View>
                </View>
              </BlurView>
            </View>
          ))}
        </Animated.View>

        {/* Motivational Quote */}
        <Animated.View
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <BlurView intensity={80} tint={colors.background === '#121212' ? 'dark' : 'light'} style={styles.quoteCard}>
            <LinearGradient
              colors={[colors.surface, colors.accent]}
              start={{ x: 0, y: 0 }} 
              end={{ x: 1, y: 1 }}
              style={styles.quoteGradient}
            >
              <Star size={32} color={colors.primary} />
              <Text style={[styles.quoteText, { color: colors.primary, ...typography.body }]}>
                "The beautiful thing about learning is that no one can take it away from you."
              </Text>
              <Text style={[styles.quoteAuthor, { color: colors.primary, ...typography.caption }]}>— B.B. King</Text>
            </LinearGradient>
          </BlurView>
        </Animated.View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 65,
    paddingBottom: 35,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
  },
  headerContent: {
    alignItems: 'center',
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 28,
  },
  greeting: {
    marginBottom: 10,
  },
  welcomeTitle: {
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    borderRadius: 55,
    borderWidth: 1.5,
    borderColor: '#d9c4b0',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    marginBottom: 5,
  },
  statLabel: {
    textAlign: 'center',
    opacity: 0.9,
  },
  statDivider: {
    width: 1.5,
    height: 45,
    marginHorizontal: 18,
    opacity: 0.3,
    borderRadius: 1,
  },
  content: {
    padding: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  sectionTitle: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  seeAllText: {
    fontWeight: '600',
    opacity: 0.85,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  quickActionCard: {
    width: (width - 66) / 2,
    aspectRatio: 1,
    borderRadius: 71,
    borderWidth: 1.5,
    borderColor: '#d9c4b0',
    overflow: 'hidden',
    marginTop: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  quickActionBlur: {
    flex: 1,
    padding: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    overflow: 'hidden',
  },
  quickActionIcon: {
    width: 54,
    height: 54,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  quickActionTitle: {
    fontWeight: '700',
    marginBottom: 6,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  quickActionDescription: {
    textAlign: 'center',
    lineHeight: 18,
    opacity: 0.95,
  },
  activityCard: {
    marginBottom: 14,
    borderRadius: 60,
    borderWidth: 1.5,
    borderColor: '#d9c4b0',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  activityBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 24,
  },
  activityImage: {
    width: 64,
    height: 64,
    borderRadius: 30,
    marginRight: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontWeight: '700',
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  activitySubject: {
    marginBottom: 10,
    opacity: 0.9,
  },
  activityMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  activityTime: {
    opacity: 0.8,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  difficultyText: {
    fontWeight: '700',
    textTransform: 'uppercase',
    fontSize: 11,
    letterSpacing: 0.8,
  },
  achievementCard: {
    marginBottom: 14,
    borderRadius: 60,
    borderWidth: 1.5,
    borderColor: '#d9c4b0',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  achievementBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 22,
    borderRadius: 24,
  },
  achievementIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontWeight: '700',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  achievementDescription: {
    marginBottom: 12,
    opacity: 0.9,
    lineHeight: 18,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 10,
    borderRadius: 6,
    marginRight: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  progressText: {
    fontWeight: '700',
    minWidth: 45,
    letterSpacing: 0.5,
  },
  quoteCard: {
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: '#d9c4b0',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  quoteGradient: {
    padding: 28,
    alignItems: 'center',
  },
  quoteText: {
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 26,
    marginVertical: 18,
    letterSpacing: 0.2,
  },
  quoteAuthor: {
    fontWeight: '700',
    letterSpacing: 0.5,
    opacity: 0.95,
  },
});
