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
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import GuestBanner from '@/components/GuestBanner';
import { supabase } from '@/lib/supabase';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';


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

type Todo = {
  id: number;
  title: string;
  is_complete: boolean;
};

export default function HomeScreen() {
  const { user } = useAuth();
  const { colors, typography, spacing } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    if (user) {
      fetchTodos();
    }
  }, [user]);

  const fetchTodos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching todos:', error);
    } else {
      setTodos(data as Todo[]);
    }
    setLoading(false);
  };

  const addTodo = async () => {
    if (!newTodoTitle.trim() || !user) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const { data, error } = await supabase
      .from('todos')
      .insert([{ title: newTodoTitle, user_id: user.id }])
      .select();

    if (error) {
      console.error('Error adding todo:', error);
    } else if (data) {
      setTodos([data[0] as Todo, ...todos]);
      setNewTodoTitle('');
    }
  };

  const quickActions: QuickAction[] = [
    {
      id: '1',
      title: 'Start Learning',
      description: 'Ask a question or solve a problem',
      icon: Brain,
      color: colors.mutedGold,
      route: '/learn',
    },
    {
      id: '2',
      title: 'View Progress',
      description: 'Track your learning journey',
      icon: TrendingUp,
      color: colors.error,
      route: '/progress',
    },
    {
      id: '3',
      title: 'Challenges',
      description: 'Tackle challenging questions.',
      icon: Plus,
      color: colors.deepNavy,
      route: '/groups',
    },
    {
      id: '4',
      title: 'Achievements',
      description: 'View your accomplishments',
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
      imageUrl: 'https://images.pexels.com/photo/delicious-blueberry-lemon-cake-bars-on-blue-plate-32050434.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    },
  ];

  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'Problem Solver',
      description: 'Solve 50 problems',
      icon: Target,
      color: colors.error,
      progress: 35,
      maxProgress: 50,
    },
    {
      id: '2',
      title: 'Streak Master',
      description: '7 day learning streak',
      icon: Flame,
      color: colors.softBlush,
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
    await fetchTodos();
    setRefreshing(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return colors.accent;
      case 'medium': return colors.textSecondary;
      case 'hard': return colors.mutedGold;
      default: return colors.textSecondary;
    }
  };

 const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
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
              <BookOpen size={20} color={colors.mutedGold} />
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

        {/* Todos List */}
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
            <Text style={[styles.sectionTitle, { color: colors.primary, ...typography.h2 }]}>My Learning</Text>
          </View>
          <BlurView intensity={80} tint={colors.background === '#121212' ? 'dark' : 'light'} style={styles.todoCard}>
            <View style={styles.todoInputContainer}>
              <TextInput
                style={[styles.todoInput, { borderColor: colors.textSecondary, color: colors.text, ...typography.body }]}
                placeholder="Add a new topic to learn..."
                placeholderTextColor={colors.textSecondary}
                value={newTodoTitle}
                onChangeText={setNewTodoTitle}
              />
              <TouchableOpacity
                style={[styles.addTodoButton, { backgroundColor: colors.accent }]}
                onPress={addTodo}
              >
                <Plus size={24} color={colors.primary} />
              </TouchableOpacity>
            </View>
            <View>
              {todos.length > 0 ? (
                todos.map((item) => (
                  <View 
                    key={item.id.toString()} 
                    style={[styles.todoListItem, { borderBottomColor: colors.textSecondary }]}
                  >
                    <Text style={[item.is_complete ? styles.completed : { color: colors.text, ...typography.body }]}>
                      {item.title}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={{ color: colors.textSecondary, textAlign: 'center', paddingVertical: spacing.md, ...typography.body }}>
                  No topics yet. Add one!
                </Text>
              )}
            </View>
          </BlurView>
        </Animated.View>

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
          <Text style={[styles.sectionTitle, { color: colors.primary, ...typography.h2 }]}>Quick Actions </Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={action.id}
                style={styles.quickActionCard}
                activeOpacity={0.8}
                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
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
            <TouchableOpacity onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
              <Text style={[styles.seeAllText, { color: colors.accent, ...typography.body }]}>See All</Text>
            </TouchableOpacity>
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
            <Text style={[styles.sectionTitle, { color: colors.primary, ...typography.h2 }]}>Achievements</Text>
            <TouchableOpacity onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
              <Text style={[styles.seeAllText, { color: colors.accent, ...typography.body }]}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {achievements.map((achievement) => (
            <View
              key={achievement.id}
              style={styles.achievementCard}
            >
              <BlurView
                style={styles.achievementBlur}
                blurType="light"
                blurAmount={18}
                reducedTransparencyFallbackColor="#595952"
              >
                <View style={[styles.achievementIcon, { backgroundColor: colors.surface }]}>
                  <achievement.icon size={24} color={colors.accent} />
                </View>
                <View style={styles.achievementContent}>
                  <Text style={[styles.achievementTitle, { color: colors.primary, ...typography.body }]}>{achievement.title}</Text>
                  <Text style={[styles.achievementDescription, { color: colors.textTertiary, ...typography.caption }]}>
                    {achievement.description}
                  </Text>
                  <View style={styles.progressContainer}>
                    <View style={[styles.progressBar, { backgroundColor: colors.textSecondary }]}>
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
              colors={[colors.deepNavy, colors.charcoal, colors.mutedGold]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={styles.quoteGradient}
            >
              <Star size={32} color={colors.ivory} />
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
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    borderWidth: 1.5,
    borderColor: '#d9c4b0',
    backgroundColor: '#4a432a',
    overflow: 'hidden',
    shadowColor: '#997350',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
    backgroundColor: 'rgba(255,255,255,0.15)',
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
    gap: 17.5,
  },
  quickActionCard: {
    width: (width - 66) / 2,
    marginTop: 15,
    aspectRatio: 1,
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: '#d9c4b0',
    backgroundColor: '#10393d',
    shadowColor: '#4a90e2',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
  },

  // Inner container to clip content
  quickActionInner: {
    borderRadius: 26,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#d9c4b0',
  },

  quickActionBlur: {
    flex: 1,
    padding: 22,
    alignItems: 'center',
    minHeight: 0,
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 26,
    overflow: 'hidden',
  },

  quickActionIcon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    backgroundColor: 'rgba(255,255,255,0.25)',
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
    color: '#fff',
    letterSpacing: 0.3,
  },

  quickActionDescription: {
    textAlign: 'center',
    lineHeight: 18,
    color: '#f5f5f5',
    opacity: 0.95,
  },

// Start here - Activity Cards

activityCard: {
  marginBottom: 14,
  borderRadius: 55, // Match todoCard
  overflow: 'hidden',
  backgroundColor: '#264a2b', // Match todoCard
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.12,
  shadowRadius: 16,
  elevation: 6,
  borderWidth: 1.5,
  borderColor: '#d9c4b0',
},
activityBlur: {
  flexDirection: 'row',
  alignItems: 'center',
  padding: 15,
  backgroundColor: 'rgba(255,255,255,0.08)', // Match todoInput
  borderRadius: 55,
},
activityImage: {
  width: 64,
  height: 64,
  borderRadius: 18,
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
  borderRadius: 50, // Match quickActionCard
  overflow: 'hidden',
  backgroundColor: '#10393d', // Match quickActionCard
  shadowColor: '#4a90e2',
  shadowOffset: { width: 0, height: 12 },
  shadowOpacity: 0.18,
  shadowRadius: 20,
  elevation: 10,
  borderWidth: 1.5,
  borderColor: '#d9c4b0',
},
achievementBlur: {
  flexDirection: 'row',
  alignItems: 'center',
  padding: 22,
  backgroundColor: 'rgba(255,255,255,0.12)', // Match quickActionBlur
  borderRadius: 26,
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
  backgroundColor: 'transparent',
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

//finish here  
  
  quoteCard: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1.5,
    borderColor: '#d9c4b0',
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
  todoCard: {
    borderRadius: 25,
    padding: 20,
    marginBottom: 15,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#d9c4b0',
    backgroundColor: '#264a2b',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  todoInputContainer: {
    flexDirection: 'row',
    marginBottom: 18,
  },
  todoInput: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 14,
    marginRight: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderColor: 'rgba(255,255,255,0.15)',
  },
  addTodoButton: {
    width: 54,
    height: 54,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  todoListItem: {
    paddingVertical: 14,
    borderBottomWidth: 1.5,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  completed: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
});