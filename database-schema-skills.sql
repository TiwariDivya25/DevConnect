-- Skills Table
CREATE TABLE Skills (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, skill_name)
);

-- Skill Endorsements Table
CREATE TABLE SkillEndorsements (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  skill_id BIGINT NOT NULL REFERENCES Skills(id) ON DELETE CASCADE,
  endorser_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(skill_id, endorser_id)
);

-- Indexes for performance
CREATE INDEX idx_skills_user_id ON Skills(user_id);
CREATE INDEX idx_endorsements_skill_id ON SkillEndorsements(skill_id);
CREATE INDEX idx_endorsements_endorser_id ON SkillEndorsements(endorser_id);

-- Row Level Security (RLS) Policies
ALTER TABLE Skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE SkillEndorsements ENABLE ROW LEVEL SECURITY;

-- Skills: Anyone can read, only owner can insert/delete
CREATE POLICY "Skills are viewable by everyone" ON Skills FOR SELECT USING (true);
CREATE POLICY "Users can add their own skills" ON Skills FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own skills" ON Skills FOR DELETE USING (auth.uid() = user_id);

-- Endorsements: Anyone can read, users can endorse others' skills
CREATE POLICY "Endorsements are viewable by everyone" ON SkillEndorsements FOR SELECT USING (true);
CREATE POLICY "Users can endorse skills" ON SkillEndorsements FOR INSERT WITH CHECK (
  auth.uid() = endorser_id AND 
  auth.uid() != (SELECT user_id FROM Skills WHERE id = skill_id)
);
CREATE POLICY "Users can remove their endorsements" ON SkillEndorsements FOR DELETE USING (auth.uid() = endorser_id);
