export interface Skill {
  id: number;
  user_id: string;
  skill_name: string;
  created_at: string;
}

export interface SkillEndorsement {
  id: number;
  skill_id: number;
  endorser_id: string;
  created_at: string;
}

export interface SkillWithEndorsements extends Skill {
  endorsement_count: number;
  user_has_endorsed: boolean;
}
