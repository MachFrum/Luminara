import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  RefreshControl,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

interface IconProps {
  color: string;
  size: number;
}

const TrendingUp: React.FC<IconProps> = ({ color, size }) => <Feather name="trending-up" size={size} color={color} />;
const Calendar: React.FC<IconProps> = ({ color, size }) => <Feather name="calendar" size={size} color={color} />;
const Award: React.FC<IconProps> = ({ color, size }) => <Feather name="award" size={size} color={color} />;
const Target: React.FC<IconProps> = ({ color, size }) => <Feather name="target" size={size} color={color} />;
const Book: React.FC<IconProps> = ({ color, size }) => <Feather name="book" size={size} color={color} />;
const Clock: React.FC<IconProps> = ({ color, size }) => <Feather name="clock" size={size} color={color} />;
const Star: React.FC<IconProps> = ({ color, size }) => <Feather name="star" size={size} color={color} />;
const Flame: React.FC<IconProps> = ({ color, size }) => <Feather name="zap" size={size} color={color} />;
const Trophy: React.FC<IconProps> = ({ color, size }) => <Feather name="award" size={size} color={color} />;
const ChevronRight: React.FC<IconProps> = ({ color, size }) => <Feather name="chevron-right" size={size} color={color} />;
const BarChart3: React.FC<IconProps> = ({ color, size }) => <Feather name="bar-chart-3" size={size} color={color} />;
const Users: React.FC<IconProps> = ({ color, size }) => <Feather name="users" size={size} color={color} />;
const Zap: React.FC<IconProps> = ({ color, size }) => <Feather name="zap" size={size} color={color} />;

import AnimatedCounter from '@/components/AnimatedCounter';
import ProgressRing from '@/components/ProgressRing';
import ActivityChart from '@/components/ActivityChart';
import AchievementBadge from '@/components/AchievementBadge';
import { ProgressScreenData } from '@/types/progress';
import { useTheme } from '@/contexts/ThemeContext';

const { width } = Dimensions.get('window');

export default function ProgressScreen() {
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('week');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // Mock data - in a real app, this would come from an API
  const progressData: ProgressScreenData = {
    stats: {
      challengesSolved: 38,
      topicsLearned: 23,
      goalsDone: 11,
      totalPoints: 462,
      level: 12,
      rank: 'Learning Explorer',
    },
    activities: [
      { date: '2025-01-15', problems: 5, minutes: 45, completed: true },
      { date: '2025-01-16', problems: 3, minutes: 30, completed: true },
      { date: '2025-01-17', problems: 7, minutes: 60, completed: true },
      { date: '2025-01-18', problems: 4, minutes: 35, completed: true },
      { date: '2025-01-19', problems: 6, minutes: 50, completed: true },
      { date: '2025-01-20', problems: 2, minutes: 20, completed: true },
      { date: '2025-01-21', problems: 8, minutes: 70, completed: true },
    ],
    subjects: [
      {
        id: '1',
        name: 'Quadratic Equations',
        progress: 85,
        color: colors.primary,
        problems: 47,
        totalProblems: 60, // number of questions
        lastActivity: '2 hours ago',
      },
      {
        id: '2',
        name: 'Photosynthesis',
        progress: 70,
        color: colors.primary,
        problems: 32,
        totalProblems: 45,
        lastActivity: '1 day ago',
      },
      {
        id: '3',
        name: 'AWS Lambda',
        progress: 60,
        color: colors.accent,
        problems: 28,
        totalProblems: 50,
        lastActivity: '3 hours ago',
      },
      {
        id: '4',
        name: 'Digital Marketing',
        progress: 75,
        color: colors.primary,
        problems: 35,
        totalProblems: 40,
        lastActivity: '5 hours ago',
      },
    ],
    achievements: [
      {
        id: '1',
        title: 'Problem Solver',
        description: 'Solved 50 problems',
        color: colors.primary,
        unlockedAt: '2025-01-20',
        rarity: 'epic',
        progress: 50,
        maxProgress: 50,
      },
      {
        id: '2',
        title: 'Streak Master',
        description: '7 days in a row',
        color: colors.error,
        unlockedAt: '2025-01-21',
        rarity: 'legendary',
      },
      {
        id: '3',
        title: 'Quick Learner',
        description: 'Completed 5 topics',
        color: colors.warning,
        unlockedAt: '2025-01-19',
        rarity: 'rare',
      },
      {
        id: '4',
        title: 'Dedicated Student',
        description: '20 hours learned',
        color: colors.success,
        unlockedAt: '2025-01-18',
        rarity: 'common',
        progress: 42,
        maxProgress: 50,
      },
    ],
    goals: [
      {
        id: '1',
        title: 'Weekly Challenge',
        description: 'Solve 50 problems this week',
        progress: 35,
        target: 50,
        deadline: '2024-01-28',
        type: 'weekly',
        icon: 'target',
        color: colors.primary,
      },
      {
        id: '2',
        title: 'Study Marathon',
        description: 'Study for 10 hours this week',
        progress: 7.5,
        target: 10,
        deadline: '2024-01-28',
        type: 'weekly',
        icon: 'clock',
        color: colors.primary,
      },
    ],
  };

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

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const triggerHapticFeedback = () => {
    if (Platform.OS !== 'web') {
      // Haptic feedback would be implemented here for native platforms
    }
  };

  const StatCard = ({ icon: Icon, label, value, suffix = '', color = colors.primary }: any) => (
    <TouchableOpacity
      style={styles.statCard}
      onPress={triggerHapticFeedback}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={[color + '20', color + '10']}
        style={styles.statGradient}
      >
        <View style={[styles.statIcon, { backgroundColor: color + '30' }]}>
          <Icon size={20} color={color} />
        </View>
        <AnimatedCounter
          value={value}
          suffix={suffix}
          style={[styles.statValue, { color }]}
          duration={1200}
        />
        <Text style={[styles.statLabel, { color: colors.primary }]}>{label}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const SubjectCard = ({ subject }: any) => (
    <TouchableOpacity style={[styles.subjectCard,{
                    backgroundColor: colors.background === '#121212'
                      ? '#000000'
                      : '#fff',
                    shadowColor: colors.background === '#121212'
                      ? '#fff'
                      : '#000',
                  },{shadowColor: colors.shadow }]} activeOpacity={0.8}>
      <View style={styles.subjectLeft}>
        <ProgressRing
          size={60}
          strokeWidth={6}
          progress={subject.progress}
          color={subject.color}
          backgroundColor={colors.border}
        >
          <Text style={[styles.progressPercentage, { color: colors.text }]}>{subject.progress}%</Text>
        </ProgressRing>
        <View style={styles.subjectInfo}>
          <Text style={[styles.subjectName, { color: colors.text }]}>{subject.name}</Text>
          <Text style={[styles.subjectStats, { color: colors.textSecondary }]}>
            {subject.problems}/{subject.totalProblems} problems
          </Text>
          <Text style={[styles.subjectActivity, { color: colors.textTertiary }]}>Last: {subject.lastActivity}</Text>
        </View>
      </View>
      <ChevronRight size={20} color={colors.textTertiary} />
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.primary}
          colors={[colors.primary]}
        />
      }
    >
      {/* Header */}
      <LinearGradient colors={[colors.surface, colors.charcoal]} style={[styles.header, { borderRadius: 30 }]}>
        <Animated.View
          style={[
            styles.headerContent,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.headerTop}>
            <View>
              <Text style={[styles.headerTitle, { color: colors.Primary }]}>Your Progress</Text>
              <Text style={[styles.headerSubtitle, { color: colors.primary }]}>
                Level {progressData.stats.level} • {progressData.stats.rank}
              </Text>
            </View>
            <View style={[styles.pointsBadge, { backgroundColor: colors.primary }]}>
              <Zap size={16} color="#FFD700" />
              <Text style={[styles.pointsText, { color: colors.mutedGold}]}>{progressData.stats.totalPoints}</Text>
            </View>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <StatCard
              icon={Target}
              label="Challenges"
              value={progressData.stats.challengesSolved}
              color={colors.deepNavy}
            />
            <StatCard
              icon={Trophy}
              label="Topics"
              value={progressData.stats.topicsLearned}
              color={colors.mutedGold}
            />
            <StatCard
              icon={Flame}
              label="Goals"
              value={progressData.stats.goalsDone}
              color={colors.error}
            />
          </View>
        </Animated.View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Activity Section */}
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
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Activity Overview</Text>
            <View style={[styles.periodToggle, { backgroundColor: colors.surface }]}>
              <TouchableOpacity
                style={[
                  styles.periodButton,
                  selectedPeriod === 'week' && { backgroundColor: colors.primary },
                ]}
                onPress={() => setSelectedPeriod('week')}
              >
                <Text
                  style={[
                    styles.periodButtonText,
                    { color: selectedPeriod === 'week' ? colors.surface : colors.textSecondary },
                  ]}
                >
                  Week
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.periodButton,
                  selectedPeriod === 'month' && { backgroundColor: colors.primary },
                ]}
                onPress={() => setSelectedPeriod('month')}
              >
                <Text
                  style={[
                    styles.periodButtonText,
                    { color: selectedPeriod === 'month' ? colors.surface : colors.textSecondary },
                  ]}
                >
                  Month
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <ActivityChart data={progressData.activities} />
        </Animated.View>

        {/* Subjects Progress */}
        <Animated.View
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Topic Progress</Text>
          {progressData.subjects.map((subject) => (
            <SubjectCard key={subject.id} subject={subject} />
          ))}
        </Animated.View>

        {/* Achievements */}
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
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Achievements</Text>
            <TouchableOpacity>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.achievementsGrid}>
            {progressData.achievements.map((achievement, index) => (
              <View key={achievement.id} style={styles.achievementWrapper}>
                <AchievementBadge
                  achievement={achievement}
                  index={index}
                  onPress={triggerHapticFeedback}
                />
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Goals */}
        <Animated.View
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Current Goals</Text>
          {progressData.goals.map((goal) => (
            <TouchableOpacity key={goal.id} style={[styles.goalCard,{
                    backgroundColor: colors.background === '#121212'
                      ? '#000000'
                      : '#fff',
                    shadowColor: colors.background === '#121212'
                      ? '#fff'
                      : '#000',
                  },{ shadowColor: colors.shadow }]}>
              <View style={styles.goalHeader}>
                <View style={[styles.goalIcon, { backgroundColor: goal.color + '20' }]}>
                  <Target size={20} color={goal.color} />
                </View>
                <View style={styles.goalInfo}>
                  <Text style={[styles.goalTitle, { color: colors.text }]}>{goal.title}</Text>
                  <Text style={[styles.goalDescription, { color: colors.textSecondary }]}>{goal.description}</Text>
                </View>
                <Text style={[styles.goalProgress, { color: colors.primary }]}>
                  {Math.round((goal.progress / goal.target) * 100)}%
                </Text>
              </View>
              <View style={styles.goalProgressContainer}>
                <View style={[styles.goalProgressBar, { backgroundColor: colors.border }]}>
                  <View
                    style={[
                      styles.goalProgressFill,
                      {
                        width: `${(goal.progress / goal.target) * 100}%`,
                        backgroundColor: goal.color,
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.goalProgressText, { color: colors.text }]}>
                  {goal.progress}/{goal.target}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Insights */}
        <Animated.View
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Learning Insights</Text>
          <View style={styles.insightCard}>
            <LinearGradient
              colors={[colors.surface, colors.charcoal]}
              style={styles.insightGradient}
            >
              <TrendingUp size={24} color={colors.primary} />
              <Text style={[styles.insightTitle, { color: colors.text }]}>You're on Fire! 🔥</Text>
              <Text style={[styles.insightText, { color: colors.primary }]}>
                Your problem-solving speed has improved by 40% this week.
                Keep challenging yourself with harder problems!
              </Text>
            </LinearGradient>
          </View>
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
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#E5E7EB',
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pointsText: {
    fontWeight: '600',
    marginLeft: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  statGradient: {
    padding: 16,
    alignItems: 'center',
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  seeAllText: {
    fontWeight: '600',
  },
  periodToggle: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 2,
  },
  periodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  subjectCard: {
    borderRadius: 40,
    borderWidth: 1.5,
    borderColor: '#d9c4b0',
    padding: 16,
    marginTop: 3,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  subjectLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  progressPercentage: {
    fontSize: 12,
    fontWeight: '600',
  },
  subjectInfo: {
    marginLeft: 16,
    flex: 1,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  subjectStats: {
    fontSize: 14,
    marginBottom: 2,
  },
  subjectActivity: {
    fontSize: 12,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  achievementWrapper: {
    width: (width - 60) / 2,
  },
  goalCard: {
    borderRadius: 40,
    borderWidth: 1.5,
    borderColor: '#d9c4b0',
    padding: 16,
    marginTop: 3,
    marginBottom: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.16,
    shadowRadius: 4,
    elevation: 3,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  goalInfo: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  goalDescription: {
    fontSize: 14,
  },
  goalProgress: {
    fontSize: 16,
    fontWeight: '600',
  },
  goalProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalProgressBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    marginRight: 12,
  },
  goalProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  goalProgressText: {
    fontSize: 14,
    fontWeight: '600',
    minWidth: 40,
  },
  insightCard: {
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: '#d9c4b0',
    overflow: 'hidden',
  },
  insightGradient: {
    padding: 20,
    alignItems: 'center',
  },
  insightTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
  },
  insightText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});