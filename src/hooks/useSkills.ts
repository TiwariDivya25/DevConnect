import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase-client';
import type { Skill } from '../types/skills';

type SkillWithEndorsements = Skill & {
  endorsement_count: number;
  user_has_endorsed: boolean;
};

export const useUserSkills = (userId: string, currentUserId?: string) => {
  return useQuery({
    queryKey: ['skills', userId, currentUserId],
    queryFn: async () => {
      const { data: skills, error } = await supabase
        .from('Skills')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const skillsWithEndorsements: SkillWithEndorsements[] = await Promise.all(
        (skills || []).map(async (skill) => {
          const { count } = await supabase
            .from('SkillEndorsements')
            .select('*', { count: 'exact', head: true })
            .eq('skill_id', skill.id);

          let userHasEndorsed = false;
          if (currentUserId) {
            const { data } = await supabase
              .from('SkillEndorsements')
              .select('id')
              .eq('skill_id', skill.id)
              .eq('endorser_id', currentUserId)
              .single();
            userHasEndorsed = !!data;
          }

          return {
            ...skill,
            endorsement_count: count || 0,
            user_has_endorsed: userHasEndorsed,
          };
        })
      );

      return skillsWithEndorsements;
    },
    enabled: !!userId,
  });
};

export const useAddSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, skillName }: { userId: string; skillName: string }) => {
      const { data, error } = await supabase
        .from('Skills')
        .insert({ user_id: userId, skill_name: skillName })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['skills', variables.userId] });
    },
  });
};

export const useDeleteSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ skillId, userId }: { skillId: number; userId: string }) => {
      const { error } = await supabase.from('Skills').delete().eq('id', skillId);
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['skills', variables.userId] });
    },
  });
};

export const useEndorseSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ skillId, endorserId, profileUserId }: { skillId: number; endorserId: string; profileUserId: string }) => {
      const { data, error } = await supabase
        .from('SkillEndorsements')
        .insert({ skill_id: skillId, endorser_id: endorserId })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['skills', variables.profileUserId] });
    },
  });
};

export const useRemoveEndorsement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ skillId, endorserId, profileUserId }: { skillId: number; endorserId: string; profileUserId: string }) => {
      const { error } = await supabase
        .from('SkillEndorsements')
        .delete()
        .eq('skill_id', skillId)
        .eq('endorser_id', endorserId);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['skills', variables.profileUserId] });
    },
  });
};
