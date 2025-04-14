import React, { useState } from 'react';
import { UserPlus, X } from 'lucide-react';
import { FamilyMember } from '../types';

interface FamilyMemberManagerProps {
  members: FamilyMember[];
  onAddMember: (name: string) => void;
  onRemoveMember: (id: string) => void;
}

export function FamilyMemberManager({ members, onAddMember, onRemoveMember }: FamilyMemberManagerProps) {
  const [newMemberName, setNewMemberName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMemberName.trim()) {
      onAddMember(newMemberName.trim());
      setNewMemberName('');
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border-2 border-purple-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Family Members</h2>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-200"
          >
            <UserPlus className="w-5 h-5" />
            Add Family Member
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex gap-4">
            <input
              type="text"
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              placeholder="Enter member name"
              className="flex-1 rounded-lg border-2 border-gray-200 px-4 py-2 text-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
              autoFocus
            />
            <div className="flex flex-wrap gap-2 mt-2">
              <button 
                type="submit"
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                Add Member
              </button>
              <button 
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3 py-1 bg-gray-400 text-white text-sm rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between p-4 rounded-lg border-2"
            style={{ borderColor: member.color }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: member.color }}
              />
              <span className="text-lg font-medium text-gray-900">{member.name}</span>
            </div>
            <button
              onClick={() => {
                if (window.confirm(`Are you sure you want to remove ${member.name}?`)) {
                  onRemoveMember(member.id);
                }
              }}
              className="text-gray-500 hover:text-red-600 p-1 rounded-lg hover:bg-red-50"
              aria-label={`Remove ${member.name}`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}