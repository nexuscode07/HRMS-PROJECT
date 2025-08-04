import React, { createContext, useContext, useState, ReactNode } from 'react';

interface MeetingContextType {
  showMeetings: boolean;
  setShowMeetings: (show: boolean) => void;
}

const MeetingContext = createContext<MeetingContextType | undefined>(undefined);


export const MeetingProvider = ({ children }: { children: ReactNode }) => {
  const [showMeetings, setShowMeetings] = useState(false);
  // Optionally, you can provide these demo data via context or fetch in Dashboard
  // For now, just seed the backend or Dashboard fetch with this data
  return (
    <MeetingContext.Provider value={{ showMeetings, setShowMeetings }}>
      {children}
    </MeetingContext.Provider>
  );
};

export const useMeeting = () => {
  const context = useContext(MeetingContext);
  if (!context) {
    throw new Error('useMeeting must be used within a MeetingProvider');
  }
  return context;
};
