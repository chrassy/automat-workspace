'use strict';

class SimulationService {
  constructor() {
    this.resetState();
  }

  resetState() {
    this.members = [
      {
        id: 'MEM-101',
        name: 'Marcus Vance',
        barcode: 'BAR-1001',
        membership: 'Unlimited All-Access',
        status: 'active',
        paymentStatus: 'paid',
        waiverSigned: true,
        streakDays: 14,
        lastCheckIn: 'Yesterday, 5:45 PM',
        emergencyContact: 'Elena Vance (555-019-2831)'
      },
      {
        id: 'MEM-102',
        name: 'Sarah Chen',
        barcode: 'BAR-1002',
        membership: 'Standard Gym & Locker',
        status: 'payment_past_due',
        paymentStatus: 'failed',
        waiverSigned: true,
        streakDays: 3,
        lastCheckIn: '3 days ago',
        emergencyContact: 'Ken Chen (555-019-8822)'
      },
      {
        id: 'MEM-103',
        name: 'David Miller',
        barcode: 'BAR-1003',
        membership: 'CrossFit & Open Floor',
        status: 'waiver_required',
        paymentStatus: 'paid',
        waiverSigned: false,
        streakDays: 1,
        lastCheckIn: '6 days ago',
        emergencyContact: 'Amy Miller (555-019-3344)'
      },
      {
        id: 'MEM-104',
        name: 'Elena Rostova',
        barcode: 'BAR-1004',
        membership: 'VIP Executive & Recovery',
        status: 'active',
        paymentStatus: 'paid',
        waiverSigned: true,
        streakDays: 42,
        lastCheckIn: 'Today, 7:15 AM',
        emergencyContact: 'Oleg Rostov (555-019-9900)'
      },
      {
        id: 'MEM-105',
        name: 'Jordan Hayes',
        barcode: 'BAR-1005',
        membership: 'Monthly Flex',
        status: 'frozen',
        paymentStatus: 'frozen',
        waiverSigned: true,
        streakDays: 0,
        lastCheckIn: '3 weeks ago',
        emergencyContact: 'Taylor Hayes (555-019-1212)'
      }
    ];

    this.classes = [
      {
        id: 'CLS-01',
        title: '6:00 AM Dawn Metcon HIIT',
        instructor: 'Coach Jake R.',
        time: '06:00 - 06:50 AM',
        room: 'Studio A (Main Turf)',
        capacity: 24,
        enrolled: 22,
        waitlist: 0
      },
      {
        id: 'CLS-02',
        title: '7:30 AM Athletic Reformer Pilates',
        instructor: 'Coach Maya S.',
        time: '07:30 - 08:20 AM',
        room: 'Studio B (Reformer Lab)',
        capacity: 12,
        enrolled: 12,
        waitlist: 3
      },
      {
        id: 'CLS-03',
        title: '12:00 PM Olympic Barbell Technique',
        instructor: 'Coach Tyler W.',
        time: '12:00 - 01:00 PM',
        room: 'Lifting Platform 1-6',
        capacity: 16,
        enrolled: 9,
        waitlist: 0
      },
      {
        id: 'CLS-04',
        title: '5:30 PM High-Intensity Spin & Core',
        instructor: 'Coach Samantha B.',
        time: '05:30 - 06:15 PM',
        room: 'Cycle Amphitheater',
        capacity: 30,
        enrolled: 27,
        waitlist: 0
      }
    ];

    this.checkInLogs = [
      {
        time: '08:42 AM',
        member: 'Marcus Vance',
        method: 'Mobile NFC Pass',
        gate: 'Turnstile A',
        result: 'GRANTED'
      },
      {
        time: '08:31 AM',
        member: 'Elena Rostova',
        method: 'RFID Key Fob',
        gate: 'Front Door 24/7',
        result: 'GRANTED'
      }
    ];
  }

  getMembers() {
    return this.members;
  }

  getClasses() {
    return this.classes;
  }

  getRecentLogs() {
    return this.checkInLogs;
  }

  /**
   * Process a simulated check-in event.
   * @param {string} barcodeOrId
   */
  processCheckIn(barcodeOrId) {
    if (!barcodeOrId) {
      throw new Error('Barcode or member ID is required.');
    }

    const query = String(barcodeOrId).trim().toUpperCase();
    const member = this.members.find(
      m => m.id.toUpperCase() === query || m.barcode.toUpperCase() === query || m.name.toUpperCase().includes(query)
    );

    if (!member) {
      return {
        success: false,
        accessGranted: false,
        status: 'NOT_FOUND',
        message: `No active member record matching '${barcodeOrId}'. Kiosk prompt: Please see front desk staff.`,
        member: null
      };
    }

    const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    if (member.status === 'frozen') {
      const log = { time: timeStr, member: member.name, method: 'Barcode Scan', gate: 'Turnstile A', result: 'DENIED (FROZEN)' };
      this.checkInLogs.unshift(log);
      return {
        success: false,
        accessGranted: false,
        status: 'FROZEN',
        message: `Access Denied: Membership is currently frozen. Re-activation required.`,
        member
      };
    }

    if (member.paymentStatus === 'failed') {
      const log = { time: timeStr, member: member.name, method: 'Barcode Scan', gate: 'Turnstile A', result: 'FLAGGED (PAST DUE)' };
      this.checkInLogs.unshift(log);
      return {
        success: false,
        accessGranted: false,
        status: 'PAST_DUE',
        message: `Soft Turnstile Lock: Monthly payment failed. Automated SMS payment link has been dispatched to member's phone. Front desk desk override available.`,
        member
      };
    }

    if (!member.waiverSigned) {
      const log = { time: timeStr, member: member.name, method: 'Barcode Scan', gate: 'Turnstile A', result: 'ACTION REQUIRED (WAIVER)' };
      this.checkInLogs.unshift(log);
      return {
        success: false,
        accessGranted: false,
        status: 'WAIVER_REQUIRED',
        message: `Action Required: Annual electronic liability waiver pending signature. Dispatched to member app / iPad kiosk.`,
        member
      };
    }

    // Access granted
    member.streakDays += 1;
    member.lastCheckIn = 'Just now';
    const log = { time: timeStr, member: member.name, method: 'Barcode Scan', gate: 'Turnstile A', result: 'GRANTED' };
    this.checkInLogs.unshift(log);

    return {
      success: true,
      accessGranted: true,
      status: 'GRANTED',
      message: `Access Granted! Turnstile unlocked. Welcome back, ${member.name.split(' ')[0]}! (${member.streakDays}-day streak)`,
      member
    };
  }

  /**
   * Book a spot in a class.
   * @param {string} classId
   * @param {string} memberName
   */
  bookClassSpot(classId, memberName = 'Demo Athlete') {
    const classItem = this.classes.find(c => c.id === classId);
    if (!classItem) {
      throw new Error(`Class with ID ${classId} not found.`);
    }

    if (classItem.enrolled < classItem.capacity) {
      classItem.enrolled += 1;
      return {
        success: true,
        isWaitlist: false,
        message: `Confirmed! Booked spot ${classItem.enrolled}/${classItem.capacity} for ${memberName} in ${classItem.title}.`,
        classItem
      };
    } else {
      classItem.waitlist += 1;
      return {
        success: true,
        isWaitlist: true,
        message: `Class full. Added ${memberName} to waitlist position #${classItem.waitlist}.`,
        classItem
      };
    }
  }

  /**
   * Get operational dashboard snapshot telemetry.
   */
  getDashboardTelemetry() {
    return {
      currentOccupancy: 48,
      maxCapacity: 120,
      occupancyPercentage: 40,
      todayTotalCheckIns: 194,
      mrr: 29840,
      activeMembersCount: 268,
      retentionRatePct: 96.4,
      dunningRecoveryRatePct: 78.2,
      hardwareGateStatus: 'ONLINE (2 Turnstiles, 1 Exterior Keycard)'
    };
  }
}

module.exports = new SimulationService();
