// src/services/challanService.ts

export interface Challan {
  id: string;
  violation: string;
  location: string;
  date: string;
  amount: number;
  status: 'Pending' | 'Paid';
  description: string;
}

export interface ChallanSummary {
  pendingCount: number;
  paidCount: number;
  totalPenalties: number;
  recentChallans: Challan[];
}

const mockChallansListDb: Record<string, Challan[]> = {
  '1': [
    {
      id: 'ch-101',
      violation: 'Over-speeding',
      location: 'National Highway 6, Jalgaon',
      date: 'Jun 12, 2026',
      amount: 1000,
      status: 'Pending',
      description: 'Vehicle detected traveling at 85 km/h in a 60 km/h speed zone by automated speed tracking system.'
    },
    {
      id: 'ch-102',
      violation: 'Wrong Side Driving',
      location: 'Court Chowk, Jalgaon',
      date: 'Feb 05, 2026',
      amount: 500,
      status: 'Paid',
      description: 'Vehicle reported operating in opposite direction of one-way traffic route, creating safety hazard.'
    },
    {
      id: 'ch-103',
      violation: 'No Parking Zone',
      location: 'Station Road, Jalgaon',
      date: 'Nov 20, 2025',
      amount: 500,
      status: 'Paid',
      description: 'Vehicle parked in clear towing zone, obstructing commercial market gate access.'
    }
  ],
  '2': [
    {
      id: 'ch-201',
      violation: 'No Helmet',
      location: 'MIDC Gate Chowk, Jalgaon',
      date: 'Jul 04, 2026',
      amount: 500,
      status: 'Pending',
      description: 'Rider and pillion rider operating two-wheeler vehicle without wearing standard protective safety helmets.'
    },
    {
      id: 'ch-202',
      violation: 'Red Light Jump',
      location: 'Ring Road Chowk, Jalgaon',
      date: 'May 18, 2026',
      amount: 700,
      status: 'Pending',
      description: 'Vehicle crossed active stop line during stop signal phase at signalized intersection.'
    },
    {
      id: 'ch-203',
      violation: 'Wrong Side Driving',
      location: 'Civil Hospital Road, Jalgaon',
      date: 'Apr 02, 2026',
      amount: 800,
      status: 'Paid',
      description: 'Driving against the flow of traffic on single-lane divider segment.'
    }
  ],
  '3': [],
  '4': [
    {
      id: 'ch-401',
      violation: 'Triple Riding',
      location: 'NH-6 Checkpoint, Jalgaon',
      date: 'Mar 15, 2026',
      amount: 1000,
      status: 'Pending',
      description: 'Three persons detected riding on a two-wheeler vehicle, violating motor vehicle safety load limits.'
    }
  ],
  '5': [],
  '6': [],
  '7': [
    {
      id: 'ch-701',
      violation: 'Seatbelt Violation',
      location: 'Ajanta Square, Jalgaon',
      date: 'Jan 20, 2026',
      amount: 1000,
      status: 'Pending',
      description: 'Driver operating vehicle without securing the safety seatbelt during transit.'
    }
  ],
  '8': []
};

export const getChallanSummary = async (vehicleId: string): Promise<ChallanSummary> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const list = mockChallansListDb[vehicleId] || [];
      const pending = list.filter(c => c.status === 'Pending');
      const paid = list.filter(c => c.status === 'Paid');
      const totalPenalties = pending.reduce((sum, c) => sum + c.amount, 0);

      resolve({
        pendingCount: pending.length,
        paidCount: paid.length,
        totalPenalties,
        recentChallans: list
      });
    }, 100);
  });
};

export const payChallan = async (challanId: string): Promise<{ success: boolean; transactionId: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let found = false;
      for (const vehicleId in mockChallansListDb) {
        const list = mockChallansListDb[vehicleId];
        const challan = list.find(c => c.id === challanId);
        if (challan) {
          challan.status = 'Paid';
          found = true;
          break;
        }
      }
      resolve({
        success: found,
        transactionId: 'TXN-' + Math.random().toString(36).substring(2, 11).toUpperCase()
      });
    }, 150);
  });
};
