// src/components/EmployeeActions.tsx

import React from 'react';
import { Edit , Trash2 } from 'lucide-react';

interface Props {
    onEdit: () => void;
    onDelete: () => void;
}

const EmployeeActions: React.FC<Props> = ({ onEdit, onDelete }) => {
    return (
        <div className="flex items-center space-x-2">

            <button onClick={onEdit} className="text-green-600 hover:text-green-900">
                <Edit className="w-4 h-4" />
            </button>
            <button onClick={onDelete} className="text-red-600 hover:text-red-900">
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
    );
};

export default EmployeeActions;