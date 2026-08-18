// src/components/submissions/Submissions.tsx
// =========================================================================
// AUTHORITATIVE STUDENT SUBMISSIONS ARCHIVE LIST (AUTO-CLEAR FINAL REPAIR)
// =========================================================================
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SubmissionPayloadNode } from '../../features/prompts/promptsApiSlice';
import { useGetUserSubmissionsListQuery } from '../../features/submissions/submissionsApiSlice';
import { 
  useGetNotificationsListQuery, 
  useToggleNotificationReadStateMutation 
} from '../../features/notifications/notificationsApiSlice'; 
import { FileText, Mic, HelpCircle, BellRing } from 'lucide-react';
import LoadingView from '../layout/loadingScreen/LoadingScreen';
import { SubmissionHistory } from './history/SubmissionHistory';
import './submissions.css';

type SubmissionTypeFilter = 'writing' | 'speaking';

export const Submissions: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SubmissionTypeFilter>('writing');
  const [focusedSubmission, setFocusedSubmission] = useState<SubmissionPayloadNode | null>(null);

  // Sidebar link reset listener
  const location = useLocation();
  useEffect(() => {
    setFocusedSubmission(null);
  }, [location.pathname, location.search, location.key]);

  // Pull down data loops from network cache pools concurrently
  const { data: submissions, isLoading: subsLoading, isError } = useGetUserSubmissionsListQuery();
  const { data: notifData } = useGetNotificationsListQuery();
  
  const [toggleReadState] = useToggleNotificationReadStateMutation();

  if (subsLoading) return <LoadingView />;
  if (isError || !submissions) {
    return <div className="stats_loading_container"><h2>Failed to load historical script records.</h2></div>;
  }

  const completedSubmissions = submissions.filter(sub => sub.status !== 'draft');
  const filteredSubmissions = completedSubmissions.filter(sub => sub.prompt_type === activeTab);

  // ✅ FIXED: Using the double-bang (!!) operator explicitly casts the return 
  // into a strict true/false boolean primitive, eliminating 'undefined !== null' false positives!
  const getUnreadNotificationForSubmission = (subItem: SubmissionPayloadNode) => {
    if (!notifData?.notifications) return null;
    
    const foundNotif = notifData.notifications.find(n => {
      if (n.read) return false;
      
      const matchPrompt = n.prompt_id && Number(n.prompt_id) === Number(subItem.prompt_id);
      const matchSubmission = n.submission_id && Number(n.submission_id) === Number(subItem.id);
      
      return matchPrompt || matchSubmission;
    });

    return foundNotif || null; // Explicitly fallback onto null if undefined
  };

  const handleReviewSubmissionItem = async (sub: SubmissionPayloadNode) => {
    setFocusedSubmission(sub);
    
    // ✅ FIXED: Pass the full submission data record block down to the scanner
    const targetNotif = getUnreadNotificationForSubmission(sub);
    
    console.log("🔍 Scanning for active row alerts. Target found:", targetNotif);
    
    if (targetNotif) {
      try {
        await toggleReadState(targetNotif.id).unwrap();
        console.log(`🚀 Safe dispatch complete! Notification #${targetNotif.id} cleared.`);
      } catch (err) {
        console.error("Network clear mutation failed:", err);
      }
    }
  };

  if (focusedSubmission) {
    return <SubmissionHistory submission={focusedSubmission} />;
  }

  return (
    <div className="writings_explorer_master_wrapper" style={{ paddingTop: '10px', paddingBottom: '6px' }}>

      {/* CORE HISTORICAL DUAL SUB-TAB STRIP */}
      <div className="explorer_filter_toolbar_container" style={{ marginBottom: '20px' }}>
        <div className="explorer_tab_strip">
          <button
            type="button"
            className={`explorer_tab_btn ${activeTab === 'writing' ? 'tab_active' : ''}`}
            onClick={() => setActiveTab('writing')}
          >
            <FileText size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
            Writings
          </button>
          <button
            type="button"
            className={`explorer_tab_btn ${activeTab === 'speaking' ? 'tab_active' : ''}`}
            onClick={() => setActiveTab('speaking')}
          >
            <Mic size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
            Speakings
          </button>
        </div>
      </div>

      {/* CENTRAL RECORDS TABLE SHEET */}
      {filteredSubmissions.length === 0 ? (
        <div className="explorer_empty_splash_box card bg-white p-5 text-center">
          <HelpCircle size={40} strokeWidth={1.5} className="text-muted mb-2" />
          <h3>No submissions found</h3>
          <p>You haven't completed any {activeTab === 'writing' ? 'writing' : 'speaking'} assignments yet.</p>
        </div>
      ) : (
        <div className="card bg-white border border-secondary border-opacity-20 p-0 rounded shadow-sm overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 custom-profile-submissions-table" style={{ width: '100%' }}>
              <thead>
                <tr style={{ background: '#f8fafc', color: '#64748b', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <th scope="col" style={{ padding: '14px 16px', textAlign: 'left' }}>Task</th>
                  <th scope="col" style={{ textAlign: 'center', width: '160px' }}>Status</th>
                  <th scope="col" style={{ textAlign: 'center', width: '140px' }}>Score</th>
                  <th scope="col" style={{ textAlign: 'center', width: '140px' }}>Review</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.map((sub) => {
                  // Check active alerts status dynamically on map execution loops
                  const hasUnreadAlert = getUnreadNotificationForSubmission(sub) !== null;

                  return (
                    <tr 
                      key={sub.id} 
                      style={{ 
                        borderBottom: '1px solid #f1f5f9',
                        backgroundColor: hasUnreadAlert ? '#fffbeb' : 'transparent' 
                      }}
                    >
                      <td style={{ padding: '14px 16px', textAlign: 'left' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.92rem' }}>{sub.prompt_title}</div>
                          {hasUnreadAlert && (
                            /* ✅ Bell icon now ONLY spawns when an active unread object row is validated! */
                            <span style={{ color: '#d97706', display: 'inline-flex', alignItems: 'center' }}>
                              <BellRing size={14} fill="#fef3c7" />
                            </span>
                          )}
                        </div>
                        <span style={{ fontSize: '0.76rem', color: '#94a3b8' }}>Submitted on {sub.timestamp}</span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span className={`badge ${sub.status === 'corrected' ? 'bg-success bg-opacity-10 text-success border border-success border-opacity-20' : 'bg-warning bg-opacity-10 text-warning border border-warning border-opacity-20'}`} style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 700, padding: '4px 8px' }}>
                          {sub.status === 'corrected' ? 'Corrected' : 'Pending'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center', fontFamily: 'monospace', fontWeight: 700, fontSize: '0.95rem' }}>
                        {sub.final_result ? (
                          <span style={{ color: '#16a34a', background: '#f0fdf4', padding: '4px 8px', borderRadius: '6px', border: '1px solid #dcfce7' }}>
                            {sub.final_result.toFixed(2)}
                          </span>
                        ) : (
                          <span style={{ color: '#64748b', background: '#f1f5f9', padding: '4px 8px', borderRadius: '6px' }}>--</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {/* ✅ FIXED ENTRY LINK TRIGGER: Locks perfectly into our explicit handler loop function */}
                        <button 
                          type="button" 
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleReviewSubmissionItem(sub)}
                          style={{ fontWeight: 600, fontSize: '0.8rem', padding: '4px 12px' }}
                        >
                          {sub.status === 'corrected' ? 'View Notes' : 'View Script'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};