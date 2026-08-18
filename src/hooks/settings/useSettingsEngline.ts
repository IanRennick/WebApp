// src/hooks/profile/useSettingsEngine.ts
import { useState, useEffect, useRef } from 'react';
import { useAppDispatch } from '../hooks';
import { updateUserMetrics, removeCredentials } from '../../features/auth/authSlice';
import { 
  useGetMyProfileQuery, 
  useUpdateUserProfileMutation, 
  useRequestAccountDeletionMutation 
} from '../../features/users/usersApiSlice';

export const useSettingsEngine = () => {
  const dispatch = useAppDispatch();

  // ✅ FETCH FULL ACCOUNT STRINGS STRAIGHT FROM POSTGRES DECK
  const { data: profile, isLoading: isProfileLoading } = useGetMyProfileQuery();
  
  const [updateUserProfile, { isLoading: isUpdating }] = useUpdateUserProfileMutation();
  const [requestAccountDeletion, { isLoading: isDeleting }] = useRequestAccountDeletionMutation();

  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [bio, setBio] = useState<string>('');
  const [levelId, setLevelId] = useState<number>(2);
  const [visibility, setVisibility] = useState<'public_profile' | 'friends_only' | 'private_profile'>('public_profile');

  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ✅ FIXED DATA HYDRATION: Seeds inputs using comprehensive on-demand profile metrics strings!
  useEffect(() => {
    if (profile) {
      setUsername(profile.username || '');
      setEmail(profile.email || '');
      setBio(profile.bio || '');
      setLevelId(profile.level_id || 2);
      setVisibility(profile.account_visibility || 'public_profile');
      setAvatarPreview(profile.avatar_url || null);
    }
  }, [profile]);

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const triggerFileSelect = () => fileInputRef.current?.click();

  const handleSettingsFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password && password !== passwordConfirmation) {
      alert("❌ Password mismatch.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('email', email);
      formData.append('bio', bio);
      formData.append('level_id', levelId.toString());
      formData.append('account_visibility', visibility);

      if (avatarFile) formData.append('avatar', avatarFile);
      if (password) {
        formData.append('current_password', currentPassword);
        formData.append('password', password);
        formData.append('password_confirmation', passwordConfirmation);
      }

      const response = await updateUserProfile(formData).unwrap();
      
      // ✅ BROADCAST HIGHLIGHTS: Updates global navigation headers layout picture paths!
      dispatch(updateUserMetrics({
        username: response.user.username,
        avatarUrl: response.user.avatar_url,
        cefrLevel: response.user.cefr_level
      }));

      setCurrentPassword('');
      setPassword('');
      passwordConfirmation && setPasswordConfirmation('');
      alert("🎉 Account settings updated and synchronized cleanly!");
    } catch (err: any) {
      console.error(err);
      alert("Profile save rejected by server guidelines.");
    }
  };

  const handleSoftDeleteRequest = async () => {
    if (!window.confirm("Deactivate your profile?")) return;
    try {
      await requestAccountDeletion().unwrap();
      alert("Securely logged out.");
      dispatch(removeCredentials());
    } catch (err) {
      console.error(err);
    }
  };

  return {
    username, setUsername,
    email, setEmail,
    bio, setBio,
    levelId, setLevelId,
    visibility, setVisibility,
    currentPassword, setCurrentPassword,
    password, setPassword,
    passwordConfirmation, setPasswordConfirmation,
    avatarPreview,
    fileInputRef,
    isUpdating: isUpdating || isProfileLoading,
    isDeleting,
    handleAvatarFileChange,
    triggerFileSelect,
    handleSettingsFormSubmit,
    handleSoftDeleteRequest
  };
};