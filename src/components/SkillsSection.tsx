import { useState } from 'react';
import { Plus, X, ThumbsUp } from 'lucide-react';
import { useUserSkills, useAddSkill, useDeleteSkill, useEndorseSkill, useRemoveEndorsement } from '../hooks/useSkills';

interface SkillsSectionProps {
  userId: string;
  currentUserId?: string;
  isOwnProfile: boolean;
}

export default function SkillsSection({ userId, currentUserId, isOwnProfile }: SkillsSectionProps) {
  const [newSkill, setNewSkill] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const { data: skills, isLoading } = useUserSkills(userId, currentUserId);
  const addSkillMutation = useAddSkill();
  const deleteSkillMutation = useDeleteSkill();
  const endorseSkillMutation = useEndorseSkill();
  const removeEndorsementMutation = useRemoveEndorsement();

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;

    try {
      await addSkillMutation.mutateAsync({ userId, skillName: newSkill.trim() });
      setNewSkill('');
      setIsAdding(false);
    } catch (error: any) {
      alert(error.message || 'Failed to add skill');
    }
  };

  const handleDeleteSkill = async (skillId: number) => {
    if (!confirm('Remove this skill?')) return;
    try {
      await deleteSkillMutation.mutateAsync({ skillId, userId });
    } catch (error: any) {
      alert(error.message || 'Failed to delete skill');
    }
  };

  const handleEndorse = async (skillId: number) => {
    if (!currentUserId) {
      alert('Please sign in to endorse skills');
      return;
    }

    const skill = skills?.find(s => s.id === skillId);
    if (!skill) return;

    try {
      if (skill.user_has_endorsed) {
        await removeEndorsementMutation.mutateAsync({ skillId, endorserId: currentUserId, profileUserId: userId });
      } else {
        await endorseSkillMutation.mutateAsync({ skillId, endorserId: currentUserId, profileUserId: userId });
      }
    } catch (error: any) {
      alert(error.message || 'Failed to update endorsement');
    }
  };

  if (isLoading) {
    return <div className="text-gray-500 dark:text-gray-400">Loading skills...</div>;
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Skills</h2>
        {isOwnProfile && !isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            <Plus className="w-4 h-4" />
            Add Skill
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleAddSkill} className="mb-4 flex gap-2">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Enter skill name"
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            autoFocus
          />
          <button
            type="submit"
            disabled={addSkillMutation.isPending}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => { setIsAdding(false); setNewSkill(''); }}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500"
          >
            Cancel
          </button>
        </form>
      )}

      {!skills || skills.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          {isOwnProfile ? 'Add your first skill to get started!' : 'No skills added yet.'}
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-full"
            >
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {skill.skill_name}
              </span>
              <button
                onClick={() => handleEndorse(skill.id)}
                disabled={isOwnProfile || endorseSkillMutation.isPending || removeEndorsementMutation.isPending}
                className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full transition ${
                  skill.user_has_endorsed
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                } ${isOwnProfile ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
              >
                <ThumbsUp className="w-3 h-3" />
                {skill.endorsement_count}
              </button>
              {isOwnProfile && (
                <button
                  onClick={() => handleDeleteSkill(skill.id)}
                  disabled={deleteSkillMutation.isPending}
                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
