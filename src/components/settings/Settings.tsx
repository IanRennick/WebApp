// src/components/profile/settings/Settings.tsx
// =========================================================================
// POLISHED MODULAR PROFILE METADATA & PRIVACY SETTINGS ENGINE VIEW
// =========================================================================
import React from 'react';
import { useSettingsEngine } from '../../hooks/settings/useSettingsEngline';
import { Camera, ShieldAlert, Save, Trash2, UserCog } from 'lucide-react';
import './settings.css';

export const Settings: React.FC = () => {
  const {
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
    isUpdating,
    isDeleting,
    handleAvatarFileChange,
    triggerFileSelect,
    handleSettingsFormSubmit,
    handleSoftDeleteRequest
  } = useSettingsEngine();

  console.log(username)

  return (
    <div className="settings_workspace_master_grid">
      <div className="settings_form_card_wrapper">
        
        {/* ✅ ITEM A FIXED: Pinned centered introductory profile workspace title banner */}
        <div className="settings_page_centered_header_wrapper">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
            <UserCog size={24} style={{ color: '#2563eb' }} />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Account Settings</h2>
          </div>
        </div>

        <form onSubmit={handleSettingsFormSubmit} className="settings_native_multipart_form">
          
          {/* 🖼️ AVATAR SELECTION DECK ROW */}
          <div className="settings_avatar_uploader_row_strip">
            <div className="settings_avatar_preview_circle_frame" onClick={triggerFileSelect} title="Click to update avatar picture">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Student avatar presentation file" />
              ) : (
                <div className="avatar_initial_fallback_string">{username.slice(0, 1).toUpperCase() || '?'}</div>
              )}
              <div className="avatar_upload_camera_overlay_badge"><Camera size={13} /></div>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarFileChange} style={{ display: 'none' }} />
            <div>
              {/* ✅ ITEM B FIXED: Enhanced upload button padding spacing matches platform rules */}
              <button type="button" className="btn btn-sm btn-outline-secondary" onClick={triggerFileSelect}>
                Upload
              </button>
            </div>
          </div>

          <hr style={{ borderStyle: 'solid', color: '#f1f5f9', margin: '24px 0' }} />

          {/* 👤 CORE CREDENTIALS ROWS BLOCK */}
          <div className="row">
            <div className="col-md-6">
              <label className="form-label">Username</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="form-control" required />
            </div>
            <div className="col-md-6">
              <label className="form-label">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" required />
            </div>
          </div>

          {/* 📝 ISOLATED PROFILE BIO BLOCK CONTAINER */}
          {/* ✅ ITEM C FIXED: Textarea layout card container stretches to full width on wide screen displays! */}
          <div className="settings_isolated_bio_area_block">
            <label className="form-label" style={{ color: '#334155' }}>Bio</label>
            <textarea 
              value={bio} 
              onChange={(e) => setBio(e.target.value)} 
              rows={3} 
              className="form-control" 
              placeholder="Describe your current study tracks, professional background, or upcoming language training goals..." 
              maxLength={500} 
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginTop: '6px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8' }}>{bio.length} / 500 characters max</span>
            </div>
          </div>

          {/* PARAMETERS TARGET METRICS CONFIGURATION SELECTORS ROW */}
          <div className="row">
            <div className="col-md-6">
              <label className="form-label">Level</label>
              <select value={levelId} onChange={(e) => setLevelId(Number(e.target.value))} className="form-select font-sans-semibold">
                <option value={2}>B1</option>
                <option value={3}>B2</option>
                <option value={4}>C1</option>
                <option value={5}>C2</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">Privacy</label>
              <select value={visibility} onChange={(e) => setVisibility(e.target.value as any)} className="form-select font-sans-semibold">
                <option value="public_profile">Public</option>
                <option value="friends_only">Friends Only</option>
                <option value="private_profile">Private</option>
              </select>
            </div>
          </div>

          {/* 🔒 DEVISE SECURITY ENCRYPTED PASSWORDS CONSOLE */}
          <div className="card settings_password_security_vault_card">
            <h4 style={{ fontSize: '0.88rem', fontWeight: 'bold', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px', margin: '0 0 12px 0' }}>
              <ShieldAlert size={16} className="text-warning" /> Update Password
            </h4>
            
            <div className="row">
              <div className="col-md-4">
                <label className="form-label" style={{ fontSize: '0.72rem' }}>Current Password</label>
                <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="form-control" placeholder="••••••••" required={password.length > 0} />
              </div>
              <div className="col-md-4">
                <label className="form-label" style={{ fontSize: '0.72rem' }}>New Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" placeholder="••••••••" />
              </div>
              <div className="col-md-4">
                <label className="form-label" style={{ fontSize: '0.72rem' }}>Confirm New Password</label>
                <input type="password" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} className="form-control" placeholder="••••••••" />
              </div>
            </div>
          </div>

          {/* PRIMARY FORM SUBMIT BAR */}
          {/* ✅ ITEM B FIXED: High contrast green Save Changes action trigger button row */}
          <div className="mt-4 d-flex justify-content-end" style={{ borderTop: '1px solid #f1f5f9', paddingTop: '18px' }}>
            <button type="submit" className="btn btn-primary px-4" disabled={isUpdating}>
              <Save size={16} /> {isUpdating ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

        </form>

        {/* HIGH-SECURITY DEACTIVATION DECK ZONE CARD CONTAINER */}
        <div className="settings_deactivate_danger_zone_block">
          <div>
            <h5 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#991b1b', margin: 0 }}>Deactivate Account</h5>
            <p style={{ fontSize: '0.78rem', color: '#7f1d1d', margin: '2px 0 0 0' }}>Are you sure you want to delete your account?</p>
          </div>
          <button 
            type="button" 
            className="btn btn-sm" 
            style={{ backgroundColor: '#dc2626', color: '#ffffff', fontWeight: 600, padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer' }} 
            onClick={handleSoftDeleteRequest} 
            disabled={isDeleting}
          >
            <Trash2 size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} /> 
            Delete
          </button>
        </div>

      </div>
    </div>
  );
};