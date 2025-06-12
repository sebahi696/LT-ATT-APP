import { Attendance } from '../types';

export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatTime = (date: string | Date): string => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const calculateWorkHours = (checkIn: Date, checkOut: Date): number => {
  const diffInMs = checkOut.getTime() - checkIn.getTime();
  return Math.round((diffInMs / (1000 * 60 * 60)) * 100) / 100;
};

export const getAttendanceStatus = (attendance: Attendance): string => {
  const checkInTime = new Date(attendance.checkIn.time);
  const scheduledTime = new Date(attendance.date);
  scheduledTime.setHours(9, 0, 0); // Assuming 9 AM is the start time

  const diffInMinutes = (checkInTime.getTime() - scheduledTime.getTime()) / (1000 * 60);

  if (diffInMinutes > 30) {
    return 'late';
  } else if (!attendance.checkOut) {
    return 'present';
  } else {
    const workHours = calculateWorkHours(checkInTime, new Date(attendance.checkOut.time));
    return workHours < 4 ? 'half_day' : 'present';
  }
};

export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

export const isWithinRadius = (
  userLocation: [number, number],
  targetLocation: [number, number],
  radiusInMeters: number = 100
): boolean => {
  const distance = calculateDistance(
    userLocation[0],
    userLocation[1],
    targetLocation[0],
    targetLocation[1]
  );
  return distance <= radiusInMeters;
};

export const getUserLocation = (): Promise<[number, number]> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve([position.coords.latitude, position.coords.longitude]);
      },
      (error) => {
        reject(error);
      }
    );
  });
}; 