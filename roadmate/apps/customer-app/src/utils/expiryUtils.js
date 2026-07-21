// src/utils/expiryUtils.js

export function getRemainingDays(expiryDateStr) {
  if (!expiryDateStr) return 365; // fallback
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiry = new Date(expiryDateStr);
  if (isNaN(expiry.getTime())) {
    return 365; // fallback for invalid date strings
  }
  expiry.setHours(0, 0, 0, 0);

  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function getDocumentStatus(expiryDateStr) {
  const diffDays = getRemainingDays(expiryDateStr);

  if (diffDays > 30) {
    return {
      type: 'valid',
      label: 'Valid 🟢',
      subText: `${diffDays} days left`,
      color: '#16A34A',
      bg: '#F0FDF4',
      border: '#BBF7D0'
    };
  } else if (diffDays <= 30 && diffDays >= 0) {
    let subText = `expires in ${diffDays} days`;
    if (diffDays === 1) subText = 'expires tomorrow';
    if (diffDays === 0) subText = 'expires today';

    return {
      type: 'soon',
      label: 'Expiring Soon 🟡',
      subText,
      color: '#D97706',
      bg: '#FFFBEB',
      border: '#FDE68A'
    };
  } else {
    const absDays = Math.abs(diffDays);
    let subText = `expired ${absDays} days ago`;
    if (absDays === 1) subText = 'expired yesterday';
    if (absDays === 0) subText = 'expired today';

    return {
      type: 'expired',
      label: 'Expired 🔴',
      subText,
      color: '#EF4444',
      bg: '#FEF2F2',
      border: '#FECACA'
    };
  }
}

export function getVehicleAlert(vehicleId, documents) {
  const vehicleDocs = documents.filter(d => d.vehicleId === vehicleId);
  const alertDocs = vehicleDocs
    .map(doc => {
      const days = getRemainingDays(doc.expiry);
      return { doc, days };
    })
    .filter(item => item.days <= 30); // includes expired (days < 0)

  if (alertDocs.length === 0) return null;

  // Sort alert documents by remaining days (nearest expiry first, i.e., lowest days first)
  alertDocs.sort((a, b) => a.days - b.days);

  const nearest = alertDocs[0];
  const docNames = {
    puc: 'PUC',
    rc: 'RC',
    'driving-license': 'DL',
    insurance: 'Insurance',
    fitness: 'Fitness',
    permit: 'Permit',
    pollution: 'Pollution',
    tax: 'Tax'
  };
  const docTitle = docNames[nearest.doc.key] || nearest.doc.label || 'Document';

  if (alertDocs.length > 1) {
    return {
      text: `⚠ ${alertDocs.length} Documents Expiring`,
      color: nearest.days < 0 ? '#EF4444' : '#D97706',
      bg: nearest.days < 0 ? '#FEF2F2' : '#FFFBEB',
      border: nearest.days < 0 ? '#FECACA' : '#FDE68A',
    };
  }

  // Only 1 document is expiring or expired
  if (nearest.days < 0) {
    const absDays = Math.abs(nearest.days);
    let desc = `${docTitle} expired ${absDays} days ago`;
    if (absDays === 1) desc = `${docTitle} expired yesterday`;
    return {
      text: `⚠ ${desc}`,
      color: '#EF4444',
      bg: '#FEF2F2',
      border: '#FECACA',
    };
  } else {
    let desc = `${docTitle} expires in ${nearest.days} days`;
    if (nearest.days === 1) desc = `${docTitle} expires tomorrow`;
    if (nearest.days === 0) desc = `${docTitle} expires today`;
    return {
      text: `⚠ ${desc}`,
      color: '#D97706',
      bg: '#FFFBEB',
      border: '#FDE68A',
    };
  }
}

export function generateNotifications(documents) {
  const notifs = [];
  const docNames = {
    puc: 'PUC certificate',
    rc: 'RC Book',
    'driving-license': 'Driving License',
    insurance: 'Insurance Policy',
  };
  const docIcons = {
    puc: '🟢',
    rc: '🔵',
    'driving-license': '🟣',
    insurance: '🟡',
  };

  documents.forEach((doc) => {
    const days = getRemainingDays(doc.expiry);
    const docTitle = docNames[doc.key] || doc.label;
    const icon = docIcons[doc.key] || '📄';

    // Define all possible notification milestones
    const milestones = [
      { trigger: 30, title: `${docTitle} expiring in 30 days`, desc: `Your ${docTitle} will expire in 30 days.` },
      { trigger: 15, title: `${docTitle} expiring in 15 days`, desc: `Reminder: Your ${docTitle} expires in 15 days.` },
      { trigger: 7, title: `${docTitle} expiring in 7 days`, desc: `${docTitle} expires in 7 days. Please renew it soon.` },
      { trigger: 3, title: `${docTitle} expiring in 3 days`, desc: `RC Book expires in 3 days.` },
      { trigger: 1, title: `${docTitle} expiring tomorrow`, desc: `Insurance expires tomorrow.` },
      { trigger: 0, title: `${docTitle} expires today`, desc: `Insurance expires today.` },
    ];

    if (days < 0) {
      // Add standard milestones as read
      milestones.forEach(m => {
        notifs.push({
          id: `${doc.key}-${doc.vehicleId}-${m.trigger}`,
          docKey: doc.key,
          vehicleId: doc.vehicleId,
          icon,
          title: m.title,
          description: m.desc,
          time: '1 week ago',
          status: 'Read'
        });
      });

      // Add expired days daily reminders
      const absDays = Math.abs(days);
      for (let i = 1; i <= absDays; i++) {
        notifs.push({
          id: `${doc.key}-${doc.vehicleId}-expired-${i}`,
          docKey: doc.key,
          vehicleId: doc.vehicleId,
          icon,
          title: `${docTitle} Expired`,
          description: `${docTitle} expired ${i} days ago. Please upload the renewed document.`,
          time: i === 1 ? 'Yesterday' : `${i} days ago`,
          status: i === absDays ? 'Unread' : 'Read'
        });
      }
    } else {
      // Valid or expiring soon
      milestones.forEach(m => {
        if (days <= m.trigger) {
          const isCurrent = days === m.trigger;
          notifs.push({
            id: `${doc.key}-${doc.vehicleId}-${m.trigger}`,
            docKey: doc.key,
            vehicleId: doc.vehicleId,
            icon,
            title: m.title,
            description: m.desc,
            time: isCurrent ? 'Today' : `${m.trigger - days} days ago`,
            status: isCurrent ? 'Unread' : 'Read'
          });
        }
      });
    }
  });

  return notifs.sort((a, b) => {
    if (a.status === 'Unread' && b.status !== 'Unread') return -1;
    if (a.status !== 'Unread' && b.status === 'Unread') return 1;
    return 0;
  });
}
