// components/common/PayrollActions.tsx
import React from 'react';
import { Eye, Pencil, Trash } from 'lucide-react';

interface Props {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const PayrollActions: React.FC<Props> = ({ onView, onEdit, onDelete }) => {
  return (
    <div className="flex items-center space-x-2">
      <button className="text-blue-600 hover:text-blue-900" onClick={onView}>
        <Eye className="w-4 h-4 inline mr-1" /> View
      </button>
      <button className="text-green-600 hover:text-green-900" onClick={onEdit}>
        <Pencil className="w-4 h-4 inline mr-1" /> Edit
      </button>
      <button className="text-red-600 hover:text-red-900" onClick={onDelete}>
        <Trash className="w-4 h-4 inline mr-1" /> Delete
      </button>
    </div>
  );
};

export default PayrollActions;