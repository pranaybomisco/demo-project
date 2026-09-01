import React, { useState } from 'react';
import { Card } from '../components/card.jsx';
import { Badge } from '../components/badge.jsx';
import { Button } from '../components/button.jsx';
import { Input } from '../components/input.jsx';
import { Select } from '../components/select.jsx';
import { Users, UserPlus, Trash2, Mail } from 'lucide-react';
import { BUTTON_LABELS, PLACEHOLDERS, ROLES, ROLE_LABELS } from '../../constants/index.js';

export const ProjectMembersView = ({
  members = [],
  ownerId,
  currentUserId,
  canManage = false,
  onAddMember,
  onRemoveMember,
}) => {
  const [inviteData, setInviteData] = useState({
    email: '',
    role: ROLES.MEMBER,
  });

  const handleInvite = async (e) => {
    e.preventDefault();
    if (inviteData.email.trim()) {
      await onAddMember(inviteData);
      setInviteData({ email: '', role: ROLES.MEMBER });
    }
  };

  const roleOptions = [
    { value: ROLES.MEMBER, label: ROLE_LABELS[ROLES.MEMBER] },
    { value: ROLES.MANAGER, label: ROLE_LABELS[ROLES.MANAGER] },
    { value: ROLES.ADMIN, label: ROLE_LABELS[ROLES.ADMIN] },
  ];

  return (
    <Card style={{ padding: '1.5rem', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <Users size={18} style={{ color: 'var(--accent-primary)' }} />
        <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Team Members ({members.length})</h3>
      </div>

      {canManage && (
        <form
          onSubmit={handleInvite}
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1.2fr auto',
            gap: '0.75rem',
            alignItems: 'end',
            marginBottom: '1.5rem',
            paddingBottom: '1.5rem',
            borderBottom: '1px solid var(--border-color)',
          }}
        >
          <Input
            label="Invite Colleague"
            placeholder={PLACEHOLDERS.INVITE_EMAIL}
            value={inviteData.email}
            onChange={(e) => setInviteData((prev) => ({ ...prev, email: e.target.value }))}
            leftIcon={<Mail size={16} />}
            type="email"
            required
          />

          <Select
            label="Role"
            options={roleOptions}
            value={inviteData.role}
            onChange={(e) => setInviteData((prev) => ({ ...prev, role: e.target.value }))}
          />

          <Button type="submit" variant="primary" leftIcon={<UserPlus size={16} />}>
            {BUTTON_LABELS.ADD_MEMBER}
          </Button>
        </form>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {members.map((member) => {
          const isOwner = member.userId === ownerId;
          const isCurrent = member.userId === currentUserId;
          const canRemove = canManage && !isOwner && !isCurrent;

          return (
            <div
              key={member.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(99, 102, 241, 0.15)',
                    color: 'var(--accent-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                  }}
                >
                  {member.user?.name ? member.user.name[0].toUpperCase() : 'U'}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                    {member.user?.name} {isOwner && <span style={{ color: 'var(--accent-primary)', fontSize: '0.75rem' }}>(Owner)</span>}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{member.user?.email}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Badge value={member.role} />
                {canRemove && (
                  <button
                    onClick={() => onRemoveMember(member.userId)}
                    className="btn-ghost"
                    style={{ padding: '0.3rem', border: 'none', cursor: 'pointer', color: 'var(--color-danger)' }}
                    title="Remove Member"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
