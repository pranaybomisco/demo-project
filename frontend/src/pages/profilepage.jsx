import React from 'react';
import { UnoptimizedProfileView as ProfileView } from '../unoptimized/views/profile/unoptimizedprofileview.jsx';
import { UI_MESSAGES } from '../constants/index.js';

export const ProfilePage = () => {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <h1>{UI_MESSAGES.PROFILE_TITLE}</h1>
          <p className="page-header-subtitle">{UI_MESSAGES.PROFILE_SUBTITLE}</p>
        </div>
      </div>

      <ProfileView />
    </div>
  );
};

export default ProfilePage;
