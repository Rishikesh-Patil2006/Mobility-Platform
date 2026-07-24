import axios from 'axios';

let currentState = {
  status: 'Available',
  busyDurationLabel: undefined,
  busyUntil: null,
  leaveStartDate: undefined,
  leaveEndDate: undefined,
  leaveUntil: null,
  lastUpdated: new Date().toISOString(),
};

const subscribers = new Set();
let timerInterval = null;

const API_URL = 'http://localhost:5000/api/services';

const notifySubscribers = () => {
  subscribers.forEach((callback) => {
    try {
      callback({ ...currentState });
    } catch (e) {
      console.error(e);
    }
  });
};

const checkAutoRestore = () => {
  const now = Date.now();

  // Auto-restore from Busy
  if (currentState.status === 'Busy' && currentState.busyUntil) {
    if (now >= currentState.busyUntil) {
      currentState = {
        ...currentState,
        status: 'Available',
        busyDurationLabel: undefined,
        busyUntil: null,
        lastUpdated: new Date().toISOString(),
      };
      notifySubscribers();
      syncAvailabilityToBackend();
    }
  }

  // Auto-restore from On Leave
  if (currentState.status === 'On Leave' && currentState.leaveUntil) {
    if (now >= currentState.leaveUntil) {
      currentState = {
        ...currentState,
        status: 'Available',
        leaveStartDate: undefined,
        leaveEndDate: undefined,
        leaveUntil: null,
        lastUpdated: new Date().toISOString(),
      };
      notifySubscribers();
      syncAvailabilityToBackend();
    }
  }
};

// Start background auto-restore checker loop
if (!timerInterval) {
  timerInterval = setInterval(checkAutoRestore, 10000);
}

export const syncAvailabilityToBackend = async () => {
  try {
    await axios.post(`${API_URL}/sync-all`, {
      availability: currentState,
    });
  } catch (e) {
    // Offline
  }
};

export const getAvailabilityState = () => {
  return { ...currentState };
};

export const subscribeAvailability = (callback) => {
  subscribers.add(callback);
  callback({ ...currentState });
  return () => {
    subscribers.delete(callback);
  };
};

export const setAvailableStatus = async () => {
  currentState = {
    status: 'Available',
    busyDurationLabel: undefined,
    busyUntil: null,
    leaveStartDate: undefined,
    leaveEndDate: undefined,
    leaveUntil: null,
    lastUpdated: new Date().toISOString(),
  };
  notifySubscribers();
  await syncAvailabilityToBackend();
  return { ...currentState };
};

export const setBusyStatus = async (durationLabel, durationMinutes) => {
  const busyUntil = Date.now() + durationMinutes * 60 * 1000;
  currentState = {
    status: 'Busy',
    busyDurationLabel: durationLabel,
    busyUntil,
    leaveStartDate: undefined,
    leaveEndDate: undefined,
    leaveUntil: null,
    lastUpdated: new Date().toISOString(),
  };
  notifySubscribers();
  await syncAvailabilityToBackend();
  return { ...currentState };
};

export const setClosedStatus = async () => {
  currentState = {
    status: 'Closed',
    busyDurationLabel: undefined,
    busyUntil: null,
    leaveStartDate: undefined,
    leaveEndDate: undefined,
    leaveUntil: null,
    lastUpdated: new Date().toISOString(),
  };
  notifySubscribers();
  await syncAvailabilityToBackend();
  return { ...currentState };
};

export const setOnLeaveStatus = async (startDate, endDate) => {
  const leaveEnd = new Date(endDate).getTime() + 86400000;
  currentState = {
    status: 'On Leave',
    busyDurationLabel: undefined,
    busyUntil: null,
    leaveStartDate: startDate,
    leaveEndDate: endDate,
    leaveUntil: isNaN(leaveEnd) ? Date.now() + 86400000 : leaveEnd,
    lastUpdated: new Date().toISOString(),
  };
  notifySubscribers();
  await syncAvailabilityToBackend();
  return { ...currentState };
};
