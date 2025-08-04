import React, { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md' 
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-black bg-opacity-30"
          onClick={onClose}
        />

        {/* Modal Content */}
        <div className={`
          inline-block w-full ${sizeClasses[size]} p-6 my-8 overflow-hidden text-left align-middle 
          transition-all transform bg-white dark:bg-white text-black dark:text-black shadow-xl rounded-2xl
        `}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-black dark:text-black">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-black dark:text-black" />
            </button>
          </div>
          
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
