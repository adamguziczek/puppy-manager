import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, X, CalendarDays, ChevronLeft, ChevronRight, FileText, CheckCircle, XCircle, Eye } from 'lucide-react';

const initialApplications = [
  { id: 1, name: 'Sarah Johnson', phone: '555-0123', email: 'sarah.j@email.com', submittedDate: '2026-01-15' },
  { id: 2, name: 'Michael Chen', phone: '555-0456', email: 'mchen@email.com', submittedDate: '2026-01-14' },
  { id: 3, name: 'Emily Rodriguez', phone: '555-0789', email: 'emily.r@email.com', submittedDate: '2026-01-13' },
  { id: 4, name: 'David Thompson', phone: '555-0321', email: 'dthompson@email.com', submittedDate: '2026-01-12' },
  { id: 5, name: 'Jessica Miller', phone: '555-0654', email: 'jmiller@email.com', submittedDate: '2026-01-11' },
  { id: 6, name: 'Robert Martinez', phone: '555-0987', email: 'rmartinez@email.com', submittedDate: '2026-01-10' },
  { id: 7, name: 'Amanda Foster', phone: '555-0246', email: 'afoster@email.com', submittedDate: '2026-01-09' },
  { id: 8, name: 'Christopher Lee', phone: '555-0135', email: 'clee@email.com', submittedDate: '2026-01-08' },
  { id: 9, name: 'Nicole Anderson', phone: '555-0864', email: 'nanderson@email.com', submittedDate: '2026-01-07' },
  { id: 10, name: 'James Wilson', phone: '555-0579', email: 'jwilson@email.com', submittedDate: '2026-01-06' }
];

export default function PuppyClientManager() {
  const [pendingApplications, setPendingApplications] = useState(initialApplications);
  const [clients, setClients] = useState([]);
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showApplications, setShowApplications] = useState(false);
  const [showApplicationDetails, setShowApplicationDetails] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [selectedClientForNotes, setSelectedClientForNotes] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('pickupDate');
  const [error, setError] = useState('');
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [eventFormData, setEventFormData] = useState({ title: '', date: '', notes: '' });
  const [formData, setFormData] = useState({
    name: '', address: '', phone: '', email: '', dam: '', sire: '',
    puppyDob: '', gender: '', pickNumber: '', paymentDate: '', paymentType: '',
    pickupDate: '', notes: ''
  });

  console.log('Component mounted - showConfirmModal state exists:', showConfirmModal !== undefined);

  useEffect(() => {
    const saved = localStorage.getItem('puppyClients');
    const savedEvents = localStorage.getItem('puppyEvents');
    const savedApps = localStorage.getItem('pendingApplications');
    
    // Clear old data and start fresh
    if (saved) setClients(JSON.parse(saved));
    else setClients([]);
    
    if (savedEvents) setEvents(JSON.parse(savedEvents));
    else setEvents([]);
    
    if (savedApps) {
      setPendingApplications(JSON.parse(savedApps));
    } else {
      setPendingApplications(initialApplications);
    }
  }, []);

  useEffect(() => {
    if (clients.length > 0) localStorage.setItem('puppyClients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('puppyEvents', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('pendingApplications', JSON.stringify(pendingApplications));
  }, [pendingApplications]);

  // Auto-cleanup: Remove events for deleted clients
  useEffect(() => {
    const clientIds = clients.map(c => c.id);
    const validEvents = events.filter(e => clientIds.includes(e.appointmentId));
    if (validEvents.length !== events.length) {
      console.log('Cleaning up orphaned events. Before:', events.length, 'After:', validEvents.length);
      setEvents(validEvents);
    }
  }, [clients]);

  const resetForm = () => {
    setFormData({
      name: '', address: '', phone: '', email: '', dam: '', sire: '',
      puppyDob: '', gender: '', pickNumber: '', paymentDate: '', paymentType: '',
      pickupDate: '', notes: ''
    });
    setEditingId(null);
    setShowForm(false);
    setError('');
  };

  const handleSubmit = () => {
    if (!formData.name || formData.name.trim() === '') {
      setError('Please enter a name for the client');
      return;
    }
    if (editingId) {
      setClients(clients.map(c => c.id === editingId ? { ...formData, id: editingId } : c));
    } else {
      setClients([...clients, { ...formData, id: Date.now() }]);
    }
    resetForm();
  };

  const handleEdit = (client) => {
    setFormData(client);
    setEditingId(client.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      setClients(clients.filter(c => c.id !== id));
    }
  };

  const handleAddEvent = (clientId) => {
    setSelectedClientId(clientId);
    setShowEventForm(true);
  };

  const handleEventSubmit = () => {
    if (!eventFormData.title || !eventFormData.date) {
      setError('Please enter a title and date');
      return;
    }
    setEvents([...events, { ...eventFormData, id: Date.now(), appointmentId: selectedClientId }]);
    setEventFormData({ title: '', date: '', notes: '' });
    setShowEventForm(false);
    setSelectedClientId(null);
    setError('');
  };

  const handleDeleteEvent = (eventId) => {
    if (window.confirm('Delete this event?')) {
      setEvents(events.filter(e => e.id !== eventId));
    }
  };

  const handleViewApplication = (app) => {
    setSelectedApplication(app);
    setShowApplicationDetails(true);
  };

  const handleAcceptApplication = (app) => {
    const newClient = {
      id: Date.now(),
      name: app.name,
      phone: app.phone,
      email: app.email,
      address: '', dam: '', sire: '', puppyDob: '', gender: '',
      pickNumber: '', paymentDate: '', paymentType: '', pickupDate: '',
      notes: `Application submitted: ${app.submittedDate}`
    };
    setClients([...clients, newClient]);
    setPendingApplications(pendingApplications.filter(a => a.id !== app.id));
    setShowApplicationDetails(false);
    setSelectedApplication(null);
  };

  const handleDenyApplication = (appId) => {
    const app = pendingApplications.find(a => a.id === appId);
    if (!app) return;
    
    setConfirmAction({
      message: `Deny application from ${app.name}?`,
      onConfirm: () => {
        setPendingApplications(pendingApplications.filter(a => a.id !== appId));
        if (selectedApplication && selectedApplication.id === appId) {
          setShowApplicationDetails(false);
          setSelectedApplication(null);
        }
        setShowConfirmModal(false);
      }
    });
    setShowConfirmModal(true);
  };

  const handleOpenNotes = (client) => {
    setSelectedClientForNotes(client);
    setShowNotesModal(true);
  };

  const handleSaveNotes = (notes) => {
    setClients(clients.map(c => c.id === selectedClientForNotes.id ? { ...c, notes } : c));
    setShowNotesModal(false);
    setSelectedClientForNotes(null);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

  const getCalendarDays = () => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startingDayOfWeek = firstDay.getDay();
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  };

  const getEventsForDate = (day) => {
    if (!day) return [];
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const pickups = clients.filter(c => c.pickupDate === dateStr);
    const customEvents = events.filter(e => e.date === dateStr);
    return [...pickups.map(c => ({ type: 'pickup', data: c })), ...customEvents.map(e => ({ type: 'event', data: e }))];
  };

  const filteredAndSorted = clients
    .filter(c => {
      const s = searchTerm.toLowerCase();
      return c.name.toLowerCase().includes(s) || c.email.toLowerCase().includes(s) ||
             c.phone.includes(s) || c.dam.toLowerCase().includes(s) || c.sire.toLowerCase().includes(s);
    })
    .sort((a, b) => {
      if (sortField === 'pickupDate') return new Date(a.pickupDate || '9999') - new Date(b.pickupDate || '9999');
      if (sortField === 'puppyDob') return new Date(a.puppyDob || '9999') - new Date(b.puppyDob || '9999');
      if (sortField === 'paymentDate') return new Date(a.paymentDate || '9999') - new Date(b.paymentDate || '9999');
      return 0;
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-2 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-3 sm:p-6 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">Puppy Client Manager</h1>
          
          <div className="flex flex-col md:flex-row gap-4 mb-4 sm:mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={showForm}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-base disabled:opacity-50"
              />
            </div>
            <select value={sortField} onChange={(e) => setSortField(e.target.value)} className="px-4 py-2 border rounded-lg text-base">
              <option value="pickupDate">Sort by Pickup Date</option>
              <option value="puppyDob">Sort by Puppy DOB</option>
              <option value="paymentDate">Sort by Payment Date</option>
            </select>
            <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Plus size={20} /> New Client
            </button>
            <button onClick={() => setShowCalendar(!showCalendar)} className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              <CalendarDays size={20} /> {showCalendar ? 'Hide' : 'Show'} Calendar
            </button>
            <button onClick={() => setShowApplications(!showApplications)} className="flex items-center gap-2 px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 relative">
              <FileText size={20} /> Applications
              {pendingApplications.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                  {pendingApplications.length}
                </span>
              )}
            </button>
          </div>

          {showConfirmModal && confirmAction && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 className="text-lg font-bold mb-4">Confirm Action</h3>
                <p className="mb-6 text-gray-700">{confirmAction.message}</p>
                <div className="flex gap-3">
                  <button
                    onClick={confirmAction.onConfirm}
                    className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {showApplications && (
            <div className="mb-6 bg-orange-50 p-4 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Pending Applications ({pendingApplications.length})</h2>
              {pendingApplications.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No pending applications</div>
              ) : (
                <div className="space-y-3">
                  {pendingApplications.map(app => (
                    <div key={app.id} className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-lg">{app.name}</div>
                        <div className="text-sm text-gray-600">
                          <div>Phone: {app.phone}</div>
                          <div>Email: {app.email}</div>
                          <div>Submitted: {app.submittedDate}</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleViewApplication(app)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                          <Eye size={18} /> View
                        </button>
                        <button onClick={() => handleAcceptApplication(app)} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                          <CheckCircle size={18} /> Accept
                        </button>
                        <button onClick={() => handleDenyApplication(app.id)} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                          <XCircle size={18} /> Deny
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {showApplicationDetails && selectedApplication && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
              <div className="flex justify-center p-4">
                <div className="bg-white rounded-lg p-6 max-w-2xl w-full mt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Application Details</h2>
                    <button onClick={() => setShowApplicationDetails(false)} className="text-gray-500 hover:text-gray-700">
                      <X size={24} />
                    </button>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg space-y-3 mb-4">
                    <div><span className="font-semibold">Name:</span> {selectedApplication.name}</div>
                    <div><span className="font-semibold">Phone:</span> {selectedApplication.phone}</div>
                    <div><span className="font-semibold">Email:</span> {selectedApplication.email}</div>
                    <div><span className="font-semibold">Submitted:</span> {selectedApplication.submittedDate}</div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => handleAcceptApplication(selectedApplication)} className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
                      <CheckCircle size={20} /> Accept
                    </button>
                    <button onClick={() => handleDenyApplication(selectedApplication.id)} className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700">
                      <XCircle size={20} /> Deny
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showCalendar && (
            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <button onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1))} className="p-2 hover:bg-gray-200 rounded">
                  <ChevronLeft size={24} />
                </button>
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-bold">{calendarDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
                  <button onClick={() => setCalendarDate(new Date())} className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                    Today
                  </button>
                </div>
                <button onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1))} className="p-2 hover:bg-gray-200 rounded">
                  <ChevronRight size={24} />
                </button>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                  <div key={d} className="text-center font-semibold text-sm py-2">{d}</div>
                ))}
                {getCalendarDays().map((day, idx) => {
                  const dayEvents = day ? getEventsForDate(day) : [];
                  const today = new Date();
                  const isToday = day === today.getDate() && calendarDate.getMonth() === today.getMonth() && calendarDate.getFullYear() === today.getFullYear();
                  return (
                    <div key={idx} className={`min-h-24 p-2 border rounded ${day ? 'bg-white' : 'bg-gray-100'} ${isToday ? 'ring-2 ring-blue-500' : ''}`}>
                      {day && (
                        <>
                          <div className="font-semibold text-sm mb-1">{day}</div>
                          <div className="space-y-1">
                            {dayEvents.map((evt, i) => (
                              <div key={i} onClick={() => handleEventClick(evt)} className={`text-xs p-1 rounded cursor-pointer hover:opacity-80 ${evt.type === 'pickup' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                                {evt.type === 'pickup' ? `Pickup: ${evt.data.name}` : evt.data.title}
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
              <div className="flex justify-center p-4">
                <div className="bg-white rounded-lg p-6 max-w-2xl w-full mt-4 mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">{editingId ? 'Edit' : 'New'} Client</h2>
                    <button onClick={resetForm} className="text-gray-500 hover:text-gray-700"><X size={24} /></button>
                  </div>
                  {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div><label className="block text-sm font-medium mb-1">Name *</label><input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border rounded" /></div>
                    <div><label className="block text-sm font-medium mb-1">Phone</label><input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-3 py-2 border rounded" /></div>
                    <div className="md:col-span-2"><label className="block text-sm font-medium mb-1">Address</label><input type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full px-3 py-2 border rounded" /></div>
                    <div className="md:col-span-2"><label className="block text-sm font-medium mb-1">Email</label><input type="text" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 border rounded" /></div>
                    <div><label className="block text-sm font-medium mb-1">Dam</label><input type="text" value={formData.dam} onChange={(e) => setFormData({...formData, dam: e.target.value})} className="w-full px-3 py-2 border rounded" /></div>
                    <div><label className="block text-sm font-medium mb-1">Sire</label><input type="text" value={formData.sire} onChange={(e) => setFormData({...formData, sire: e.target.value})} className="w-full px-3 py-2 border rounded" /></div>
                    <div><label className="block text-sm font-medium mb-1">Puppy DOB</label><input type="date" value={formData.puppyDob} onChange={(e) => setFormData({...formData, puppyDob: e.target.value})} className="w-full px-3 py-2 border rounded" /></div>
                    <div><label className="block text-sm font-medium mb-1">Gender</label><select value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})} className="w-full px-3 py-2 border rounded"><option value="">Select...</option><option value="Male">Male</option><option value="Female">Female</option></select></div>
                    <div><label className="block text-sm font-medium mb-1">Pick Number</label><input type="number" min="1" value={formData.pickNumber} onChange={(e) => setFormData({...formData, pickNumber: e.target.value})} className="w-full px-3 py-2 border rounded" /></div>
                    <div><label className="block text-sm font-medium mb-1">Payment Date</label><input type="date" value={formData.paymentDate} onChange={(e) => setFormData({...formData, paymentDate: e.target.value})} className="w-full px-3 py-2 border rounded" /></div>
                    <div><label className="block text-sm font-medium mb-1">Payment Type</label><select value={formData.paymentType} onChange={(e) => setFormData({...formData, paymentType: e.target.value})} className="w-full px-3 py-2 border rounded"><option value="">Select...</option><option value="PayPal">PayPal</option><option value="Venmo">Venmo</option><option value="Cash">Cash</option><option value="Check">Check</option><option value="Deposit">Deposit</option></select></div>
                    <div><label className="block text-sm font-medium mb-1">Pickup Date</label><input type="date" value={formData.pickupDate} onChange={(e) => setFormData({...formData, pickupDate: e.target.value})} className="w-full px-3 py-2 border rounded" /></div>
                    <div className="md:col-span-2"><label className="block text-sm font-medium mb-1">Notes</label><textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} className="w-full px-3 py-2 border rounded" rows="3" /></div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={handleSubmit} className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">{editingId ? 'Update' : 'Create'} Client</button>
                    <button onClick={resetForm} className="px-6 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300">Cancel</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showEventForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
              <div className="flex justify-center p-4">
                <div className="bg-white rounded-lg p-6 max-w-md w-full mt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Add Event</h2>
                    <button onClick={() => { setShowEventForm(false); setError(''); }} className="text-gray-500 hover:text-gray-700"><X size={24} /></button>
                  </div>
                  {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
                  <div className="space-y-4">
                    <div><label className="block text-sm font-medium mb-1">Title *</label><input type="text" value={eventFormData.title} onChange={(e) => setEventFormData({...eventFormData, title: e.target.value})} className="w-full px-3 py-2 border rounded" /></div>
                    <div><label className="block text-sm font-medium mb-1">Date *</label><input type="date" value={eventFormData.date} onChange={(e) => setEventFormData({...eventFormData, date: e.target.value})} className="w-full px-3 py-2 border rounded" /></div>
                    <div><label className="block text-sm font-medium mb-1">Notes</label><textarea value={eventFormData.notes} onChange={(e) => setEventFormData({...eventFormData, notes: e.target.value})} className="w-full px-3 py-2 border rounded" rows="3" /></div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button onClick={handleEventSubmit} className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">Add Event</button>
                    <button onClick={() => { setShowEventForm(false); setError(''); }} className="px-6 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300">Cancel</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showNotesModal && selectedClientForNotes && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
              <div className="flex justify-center p-4">
                <div className="bg-white rounded-lg p-6 max-w-2xl w-full mt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Notes for {selectedClientForNotes.name}</h2>
                    <button onClick={() => setShowNotesModal(false)} className="text-gray-500 hover:text-gray-700"><X size={24} /></button>
                  </div>
                  <div className="mb-4 p-3 bg-gray-50 rounded text-sm space-y-1">
                    {selectedClientForNotes.phone && <div><span className="font-semibold">Phone:</span> {selectedClientForNotes.phone}</div>}
                    {selectedClientForNotes.email && <div><span className="font-semibold">Email:</span> {selectedClientForNotes.email}</div>}
                  </div>
                  <div><label className="block text-sm font-medium mb-1">Notes</label><textarea defaultValue={selectedClientForNotes.notes || ''} onChange={(e) => setSelectedClientForNotes({...selectedClientForNotes, notes: e.target.value})} className="w-full px-3 py-2 border rounded" rows="10" /></div>
                  <div className="flex gap-3 mt-4">
                    <button onClick={() => handleSaveNotes(selectedClientForNotes.notes || '')} className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">Save</button>
                    <button onClick={() => setShowNotesModal(false)} className="px-6 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300">Cancel</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showEventDetails && selectedEvent && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
              <div className="flex justify-center p-4">
                <div className="bg-white rounded-lg p-6 max-w-lg w-full mt-4 mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Event Details</h2>
                    <button onClick={() => setShowEventDetails(false)} className="text-gray-500 hover:text-gray-700"><X size={24} /></button>
                  </div>
                  {selectedEvent.type === 'pickup' ? (
                    <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                      <div className="text-sm text-blue-600 font-semibold mb-2">Puppy Pickup</div>
                      <div><span className="font-semibold">Client:</span> {selectedEvent.data.name}</div>
                      <div><span className="font-semibold">Date:</span> {selectedEvent.data.pickupDate}</div>
                      {selectedEvent.data.phone && <div><span className="font-semibold">Phone:</span> {selectedEvent.data.phone}</div>}
                      {selectedEvent.data.email && <div><span className="font-semibold">Email:</span> {selectedEvent.data.email}</div>}
                      {selectedEvent.data.notes && <div><span className="font-semibold">Notes:</span><div className="mt-1 text-gray-700 whitespace-pre-wrap">{selectedEvent.data.notes}</div></div>}
                    </div>
                  ) : (
                    <div className="bg-purple-50 p-4 rounded-lg space-y-2">
                      <div className="text-sm text-purple-600 font-semibold mb-2">Custom Event</div>
                      <div><span className="font-semibold">Title:</span> {selectedEvent.data.title}</div>
                      <div><span className="font-semibold">Date:</span> {selectedEvent.data.date}</div>
                      {selectedEvent.data.notes && <div><span className="font-semibold">Notes:</span><div className="mt-1 text-gray-700">{selectedEvent.data.notes}</div></div>}
                      {selectedEvent.data.appointmentId && (
                        <div className="mt-4 pt-4 border-t">
                          <span className="font-semibold">Related to:</span>
                          <div className="mt-2 bg-white p-3 rounded">
                            {(() => {
                              const client = clients.find(c => c.id === selectedEvent.data.appointmentId);
                              return client ? (
                                <div className="space-y-1">
                                  <div className="font-semibold">{client.name}</div>
                                  {client.phone && <div className="text-sm">Phone: {client.phone}</div>}
                                  {client.email && <div className="text-sm">Email: {client.email}</div>}
                                </div>
                              ) : 'Client not found';
                            })()}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  <button onClick={() => setShowEventDetails(false)} className="w-full mt-4 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300">Close</button>
                </div>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Contact</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Parents</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Puppy Info</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Payment</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Pickup Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredAndSorted.map(client => (
                  <tr key={client.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium">{client.name || '---'}</div>
                      <div className="text-sm text-gray-500">{client.address || '---'}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">{client.phone || '---'}</div>
                      <div className="text-sm text-gray-500">{client.email || '---'}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">Dam: {client.dam || '---'}</div>
                      <div className="text-sm">Sire: {client.sire || '---'}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">DOB: {client.puppyDob || '---'}</div>
                      <div className="text-sm">{client.gender || '---'} • Pick #{client.pickNumber || '---'}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">{client.paymentType || '---'}</div>
                      <div className="text-sm text-gray-500">{client.paymentDate || '---'}</div>
                    </td>
                    <td className="px-4 py-3 font-medium">{client.pickupDate || '---'}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => handleOpenNotes(client)} className="p-2 text-purple-600 hover:bg-purple-50 rounded" title="Notes">
                          <FileText size={18} />
                        </button>
                        <button onClick={() => handleAddEvent(client.id)} className="p-2 text-green-600 hover:bg-green-50 rounded" title="Add event">
                          <Plus size={18} />
                        </button>
                        <button onClick={() => handleEdit(client)} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => {
                            console.log('Trash button clicked for client:', client.id);
                            console.log('About to set confirm action...');
                            setConfirmAction({
                              message: 'Are you sure you want to delete this client?',
                              onConfirm: () => {
                                setClients(clients.filter(c => c.id !== client.id));
                                setEvents(events.filter(e => e.appointmentId !== client.id));
                                setShowConfirmModal(false);
                              }
                            });
                            console.log('About to show modal...');
                            setShowConfirmModal(true);
                            console.log('Modal state set to true');
                          }} 
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      {events.filter(e => e.appointmentId === client.id).length > 0 && (
                        <div className="mt-2 space-y-1">
                          {events.filter(e => e.appointmentId === client.id).map(event => (
                            <div key={event.id} className="flex items-center justify-between bg-purple-50 p-2 rounded text-xs">
                              <div>
                                <div className="font-semibold">{event.title}</div>
                                <div className="text-gray-600">{event.date}</div>
                                {event.notes && <div className="text-gray-500">{event.notes}</div>}
                              </div>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteEvent(event.id);
                                }} 
                                className="text-red-500 hover:text-red-700 p-1"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredAndSorted.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                {searchTerm ? 'No clients found.' : 'No clients yet. Click "New Client" to get started.'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}