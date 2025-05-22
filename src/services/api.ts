import { supabase } from '../lib/supabase';
import { 
  User, 
  Crew, 
  Challenge, 
  ChallengeSubmission, 
  LeaderboardEntry,
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
  Achievement
} from '../types';
import { handleError, cacheKey, calculateLevel, getLevelProgress } from '../utils/helpers';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

class ApiService {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();

  private async getCached<T>(key: string): Promise<T | null> {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data as T;
    }
    return null;
  }

  private setCache<T>(key: string, data: T): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  private clearCache(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  // User operations
  async getUser(userId: string): Promise<ApiResponse<User>> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return { data };
    } catch (error) {
      return { error: handleError(error) };
    }
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<ApiResponse<User>> {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      this.clearCache(cacheKey.submissions(userId));
      return { data };
    } catch (error) {
      return { error: handleError(error) };
    }
  }

  // Crew operations
  async getCrew(crewId: string): Promise<ApiResponse<Crew>> {
    try {
      const { data, error } = await supabase
        .from('crews')
        .select('*, members:users(*)')
        .eq('id', crewId)
        .single();

      if (error) throw error;
      return { data };
    } catch (error) {
      return { error: handleError(error) };
    }
  }

  async getCrews(): Promise<ApiResponse<Crew[]>> {
    try {
      const { data, error } = await supabase
        .from('crews')
        .select('*');

      if (error) throw error;
      return { data };
    } catch (error) {
      return { error: handleError(error) };
    }
  }

  async createCrew(crew: Omit<Crew, 'id'>): Promise<ApiResponse<Crew>> {
    try {
      const { data, error } = await supabase
        .from('crews')
        .insert(crew)
        .select()
        .single();

      if (error) throw error;
      return { data };
    } catch (error) {
      return { error: handleError(error) };
    }
  }

  async updateCrew(crewId: string, updates: Partial<Crew>): Promise<ApiResponse<Crew>> {
    try {
      const { data, error } = await supabase
        .from('crews')
        .update(updates)
        .eq('id', crewId)
        .select()
        .single();

      if (error) throw error;
      this.clearCache(cacheKey.challenges(crewId));
      return { data };
    } catch (error) {
      return { error: handleError(error) };
    }
  }

  // Challenge operations
  async getChallenges(crewId?: string): Promise<ApiResponse<Challenge[]>> {
    try {
      const cacheKey = `challenges_${crewId || 'all'}`;
      const cached = await this.getCached<Challenge[]>(cacheKey);
      if (cached) return { data: cached };

      let query = supabase
        .from('challenges')
        .select('*')
        .eq('isActive', true);

      if (crewId) {
        query = query.eq('crewId', crewId);
      }

      const { data, error } = await query;
      if (error) throw error;

      this.setCache(cacheKey, data);
      return { data };
    } catch (error) {
      return { error: handleError(error) };
    }
  }

  async createChallenge(challenge: Omit<Challenge, 'id'>): Promise<ApiResponse<Challenge>> {
    try {
      const { data, error } = await supabase
        .from('challenges')
        .insert(challenge)
        .select()
        .single();

      if (error) throw error;
      if (challenge.crewId) {
        this.clearCache(cacheKey.challenges(challenge.crewId));
      }
      return { data };
    } catch (error) {
      return { error: handleError(error) };
    }
  }

  // Submission operations
  async getSubmissions(
    userId: string,
    params: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<ChallengeSubmission>>> {
    try {
      const { data, error, count } = await supabase
        .from('submissions')
        .select('*', { count: 'exact' })
        .eq('userId', userId)
        .order('createdAt', { ascending: false })
        .range(params.page * params.limit, (params.page + 1) * params.limit - 1);

      if (error) throw error;
      return {
        data: {
          data,
          pagination: {
            ...params,
            total: count || 0
          }
        }
      };
    } catch (error) {
      return { error: handleError(error) };
    }
  }

  async createSubmission(
    submission: Omit<ChallengeSubmission, 'id'>
  ): Promise<ApiResponse<ChallengeSubmission>> {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .insert(submission)
        .select()
        .single();

      if (error) throw error;
      this.clearCache(cacheKey.submissions(submission.userId));
      if (submission.crewId) {
        this.clearCache(cacheKey.leaderboard(submission.crewId));
      }
      return { data };
    } catch (error) {
      return { error: handleError(error) };
    }
  }

  // Leaderboard operations
  async getLeaderboard(
    crewId: string,
    challengeId?: number
  ): Promise<ApiResponse<LeaderboardEntry[]>> {
    try {
      const cacheKey = `leaderboard_${crewId}_${challengeId || 'all'}`;
      const cached = await this.getCached<LeaderboardEntry[]>(cacheKey);
      if (cached) return { data: cached };

      let query = supabase
        .from('submissions')
        .select(`
          userId,
          score,
          users:userId (displayName),
          crews:crewId (name)
        `)
        .eq('crewId', crewId);

      if (challengeId) {
        query = query.eq('challengeId', challengeId);
      }

      const { data, error } = await query;
      if (error) throw error;

      const leaderboard = data.map((entry: any) => ({
        userId: entry.userId,
        displayName: entry.users.displayName,
        score: entry.score,
        crewId: entry.crewId,
        crewName: entry.crews?.name,
        position: 0
      }));

      // Calculate positions
      leaderboard.sort((a, b) => b.score - a.score);
      leaderboard.forEach((entry, index) => {
        entry.position = index + 1;
      });

      this.setCache(cacheKey, leaderboard);
      return { data: leaderboard };
    } catch (error) {
      return { error: handleError(error) };
    }
  }

  // User Statistics
  async getUserStats(userId: string): Promise<ApiResponse<{
    totalScore: number;
    level: number;
    levelProgress: number;
    achievements: Achievement[];
    submissionsCount: number;
    averageScore: number;
    bestScore: number;
    lastSubmission: Date | null;
  }>> {
    try {
      const cacheKey = `user_stats_${userId}`;
      const cached = await this.getCached(cacheKey);
      if (cached) return { data: cached };

      const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (userError) throw userError;

      const { data: submissions, error: submissionsError } = await supabase
        .from('submissions')
        .select('*')
        .eq('userId', userId);

      if (submissionsError) throw submissionsError;

      const stats = {
        totalScore: user.totalScore,
        level: calculateLevel(user.totalScore),
        levelProgress: getLevelProgress(user.totalScore),
        achievements: user.achievements || [],
        submissionsCount: submissions.length,
        averageScore: submissions.length > 0 
          ? submissions.reduce((acc, sub) => acc + sub.score, 0) / submissions.length 
          : 0,
        bestScore: submissions.length > 0 
          ? Math.max(...submissions.map(sub => sub.score))
          : 0,
        lastSubmission: submissions.length > 0 
          ? new Date(Math.max(...submissions.map(sub => new Date(sub.createdAt).getTime())))
          : null
      };

      this.setCache(cacheKey, stats);
      return { data: stats };
    } catch (error) {
      return { error: handleError(error) };
    }
  }

  // Crew Statistics
  async getCrewStats(crewId: string): Promise<ApiResponse<{
    totalScore: number;
    memberCount: number;
    averageScore: number;
    topPerformer: {
      userId: string;
      displayName: string;
      score: number;
    } | null;
    recentActivity: {
      userId: string;
      displayName: string;
      challengeId: string;
      score: number;
      createdAt: Date;
    }[];
  }>> {
    try {
      const cacheKey = `crew_stats_${crewId}`;
      const cached = await this.getCached(cacheKey);
      if (cached) return { data: cached };

      const { data: crew, error: crewError } = await supabase
        .from('crews')
        .select('*')
        .eq('id', crewId)
        .single();

      if (crewError) throw crewError;

      const { data: members, error: membersError } = await supabase
        .from('users')
        .select('*')
        .eq('crewId', crewId);

      if (membersError) throw membersError;

      const { data: submissions, error: submissionsError } = await supabase
        .from('submissions')
        .select(`
          *,
          users:userId (displayName)
        `)
        .eq('crewId', crewId)
        .order('createdAt', { ascending: false })
        .limit(10);

      if (submissionsError) throw submissionsError;

      const stats = {
        totalScore: crew.totalScore,
        memberCount: members.length,
        averageScore: members.length > 0 
          ? members.reduce((acc, member) => acc + member.totalScore, 0) / members.length 
          : 0,
        topPerformer: members.length > 0 
          ? members.reduce((max, member) => 
              member.totalScore > max.totalScore ? member : max
            , members[0])
          : null,
        recentActivity: submissions.map(sub => ({
          userId: sub.userId,
          displayName: sub.users.displayName,
          challengeId: sub.challengeId,
          score: sub.score,
          createdAt: new Date(sub.createdAt)
        }))
      };

      this.setCache(cacheKey, stats);
      return { data: stats };
    } catch (error) {
      return { error: handleError(error) };
    }
  }

  // Challenge Statistics
  async getChallengeStats(challengeId: string): Promise<ApiResponse<{
    totalSubmissions: number;
    averageScore: number;
    bestScore: number;
    participationRate: number;
    topParticipants: {
      userId: string;
      displayName: string;
      score: number;
      submissions: number;
    }[];
  }>> {
    try {
      const cacheKey = `challenge_stats_${challengeId}`;
      const cached = await this.getCached(cacheKey);
      if (cached) return { data: cached };

      const { data: challenge, error: challengeError } = await supabase
        .from('challenges')
        .select('*')
        .eq('id', challengeId)
        .single();

      if (challengeError) throw challengeError;

      const { data: submissions, error: submissionsError } = await supabase
        .from('submissions')
        .select(`
          *,
          users:userId (displayName)
        `)
        .eq('challengeId', challengeId);

      if (submissionsError) throw submissionsError;

      const { data: crew, error: crewError } = await supabase
        .from('crews')
        .select('members')
        .eq('id', challenge.crewId)
        .single();

      if (crewError) throw crewError;

      const memberCount = crew.members.length;
      const userSubmissions = new Map<string, { score: number; count: number; displayName: string }>();

      submissions.forEach(sub => {
        const current = userSubmissions.get(sub.userId) || { score: 0, count: 0, displayName: sub.users.displayName };
        userSubmissions.set(sub.userId, {
          score: current.score + sub.score,
          count: current.count + 1,
          displayName: current.displayName
        });
      });

      const stats = {
        totalSubmissions: submissions.length,
        averageScore: submissions.length > 0 
          ? submissions.reduce((acc, sub) => acc + sub.score, 0) / submissions.length 
          : 0,
        bestScore: submissions.length > 0 
          ? Math.max(...submissions.map(sub => sub.score))
          : 0,
        participationRate: memberCount > 0 
          ? (userSubmissions.size / memberCount) * 100 
          : 0,
        topParticipants: Array.from(userSubmissions.entries())
          .map(([userId, data]) => ({
            userId,
            displayName: data.displayName,
            score: data.score,
            submissions: data.count
          }))
          .sort((a, b) => b.score - a.score)
          .slice(0, 5)
      };

      this.setCache(cacheKey, stats);
      return { data: stats };
    } catch (error) {
      return { error: handleError(error) };
    }
  }

  // Achievement Management
  async unlockAchievement(
    userId: string,
    achievementId: string
  ): Promise<ApiResponse<Achievement>> {
    try {
      const { data: achievement, error: achievementError } = await supabase
        .from('achievements')
        .select('*')
        .eq('id', achievementId)
        .single();

      if (achievementError) throw achievementError;

      const { data: user, error: userError } = await supabase
        .from('users')
        .select('achievements')
        .eq('id', userId)
        .single();

      if (userError) throw userError;

      const achievements = user.achievements || [];
      if (achievements.some(a => a.id === achievementId)) {
        return { data: achievement };
      }

      const updatedAchievements = [
        ...achievements,
        {
          ...achievement,
          unlockedAt: new Date()
        }
      ];

      const { error: updateError } = await supabase
        .from('users')
        .update({ achievements: updatedAchievements })
        .eq('id', userId);

      if (updateError) throw updateError;

      this.clearCache(`user_stats_${userId}`);
      return { data: achievement };
    } catch (error) {
      return { error: handleError(error) };
    }
  }
}

export const api = new ApiService(); 