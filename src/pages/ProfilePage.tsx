import { useAuth } from '../hooks/useAuth';
import { useNavigate } from "react-router";
import { User, Mail, Calendar, Shield, Camera, Edit3, Globe, Github, Twitter } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import {showSuccess, showError} from "../utils/toast";

export default function ProfilePage() {
  const { user, signOut, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || "");
  const [bio, setBio] = useState(user?.user_metadata?.bio || "");
  const [location, setLocation] = useState(user?.user_metadata?.location || "");
  const [website, setWebsite] = useState(user?.user_metadata?.website || "");
  const [github, setGithub] = useState(user?.user_metadata?.github || "");
  const [twitter, setTwitter] = useState(user?.user_metadata?.twitter || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  if (!user) {
    return null;
  }

  const handleSignOut = async () => {
    try{
      await signOut();
      showSuccess("Signed Out Successfully");
      navigate("/login");
    }
    catch{
      showError("Failed to Sign Out");
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      // Reset form values when starting to edit
      setFullName(user.user_metadata?.full_name || "");
      setBio(user.user_metadata?.bio || "");
      setLocation(user.user_metadata?.location || "");
      setWebsite(user.user_metadata?.website || "");
      setGithub(user.user_metadata?.github || "");
      setTwitter(user.user_metadata?.twitter || "");
      setAvatarPreview(null);
      setAvatarFile(null);
      setUpdateError(null);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setIsUpdating(true);
    setUpdateError(null);
    
    try {
      // Handle avatar upload if a new file is selected
      let avatarUrl = user.user_metadata?.avatar_url || "";
      if (avatarFile) {
        // In a real app, we would upload the image to a storage service
        // For demo mode, we'll use a data URL
        avatarUrl = URL.createObjectURL(avatarFile);
      }
      
      const { error } = await updateProfile({
        full_name: fullName,
        bio: bio,
        location: location,
        website: website,
        github: github,
        twitter: twitter,
        avatar_url: avatarUrl
      });
      
      if (error) {
        setUpdateError(error.message);
        showError("Failed to update profile");
      } else {
        showSuccess("Profile updated successfully");
        setIsEditing(false);
      }
    } catch (err: any) {
      showError("Failed to update profile");
      console.log("Profile update error:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const displayName = user.user_metadata?.full_name || user.user_metadata?.user_name || "Anonymous User";
  const createdAt = user.created_at ? format(new Date(user.created_at), "MMMM dd, yyyy") : "Unknown";

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 h-32"></div>
          
          {/* Profile content */}
          <div className="px-8 pb-8">
            <div className="relative -mt-16 mb-6 flex justify-between items-start">
              <div className="relative">
                {avatarPreview || user.user_metadata?.avatar_url ? (
                  <img
                    src={avatarPreview || user.user_metadata?.avatar_url}
                    alt="Profile"
                    className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <User className="w-16 h-16 text-gray-400" />
                  </div>
                )}
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2 shadow-md hover:bg-blue-600 transition cursor-pointer">
                    <Camera className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setAvatarFile(file);
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setAvatarPreview(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                )}
              </div>
              <button
                onClick={handleEditToggle}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
              >
                <Edit3 className="w-4 h-4" />
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>
            </div>

            <div className="space-y-6">
              {isEditing ? (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      Edit Profile
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                      Update your profile information
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Bio
                      </label>
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Tell us about yourself"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Location
                        </label>
                        <input
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="City, Country"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                          <Globe className="w-4 h-4" />
                          Website
                        </label>
                        <input
                          type="text"
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="https://yourwebsite.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                          <Github className="w-4 h-4" />
                          GitHub
                        </label>
                        <input
                          type="text"
                          value={github}
                          onChange={(e) => setGithub(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="GitHub username"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                          <Twitter className="w-4 h-4" />
                          Twitter/X
                        </label>
                        <input
                          type="text"
                          value={twitter}
                          onChange={(e) => setTwitter(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="Twitter/X username"
                        />
                      </div>
                    </div>
                  </div>

                  {updateError && (
                    <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
                      <p className="text-sm text-red-800 dark:text-red-500">{updateError}</p>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleSaveProfile}
                      disabled={isUpdating}
                      className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition disabled:opacity-50"
                    >
                      {isUpdating ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      onClick={handleEditToggle}
                      disabled={isUpdating}
                      className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {displayName}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                      Welcome to your DevConnect profile
                    </p>
                    {user.user_metadata?.bio && (
                      <p className="mt-2 text-gray-700 dark:text-gray-300">
                        {user.user_metadata.bio}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-4 mt-6">
                    <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <Mail className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                        <p className="font-medium text-gray-900 dark:text-white">{user.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Member since</p>
                        <p className="font-medium text-gray-900 dark:text-white">{createdAt}</p>
                      </div>
                    </div>

                    {user.user_metadata?.location && (
                      <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <Shield className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                          <p className="font-medium text-gray-900 dark:text-white">{user.user_metadata.location}</p>
                        </div>
                      </div>
                    )}

                    {(user.user_metadata?.website || user.user_metadata?.github || user.user_metadata?.twitter) && (
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Social Links</p>
                        <div className="flex flex-wrap gap-2">
                          {user.user_metadata?.website && (
                            <a 
                              href={user.user_metadata.website.startsWith('http') ? user.user_metadata.website : `https://${user.user_metadata.website}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-sm hover:bg-blue-200 dark:hover:bg-blue-800 transition"
                            >
                              <Globe className="w-3 h-3" />
                              Website
                            </a>
                          )}
                          {user.user_metadata?.github && (
                            <a 
                              href={`https://github.com/${user.user_metadata.github}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-full text-sm hover:bg-gray-300 dark:hover:bg-gray-500 transition"
                            >
                              <Github className="w-3 h-3" />
                              GitHub
                            </a>
                          )}
                          {user.user_metadata?.twitter && (
                            <a 
                              href={`https://twitter.com/${user.user_metadata.twitter}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-cyan-100 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-300 rounded-full text-sm hover:bg-cyan-200 dark:hover:bg-cyan-800 transition"
                            >
                              <Twitter className="w-3 h-3" />
                              Twitter
                            </a>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <Shield className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">User ID</p>
                        <p className="font-mono text-xs font-medium text-gray-900 dark:text-white">{user.id}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={handleSignOut}
                      className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
