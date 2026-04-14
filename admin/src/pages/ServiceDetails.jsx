import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, FileText, User as UserIcon, Clock, MapPin, Building, PhoneCall, Mail, Search, Star } from 'lucide-react';

export function ServiceDetails() {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    // Initial load of services
    fetch('http://localhost:5000/api/services')
      .then(res => res.json())
      .then(data => setServices(data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (!selectedService) {
      setFormData(null);
      setShowForm(false);
      return;
    }

    setLoading(true);
    fetch(`http://localhost:5000/api/service-details/${selectedService.id}`)
      .then(res => res.json())
      .then(data => {
        const details = data.details || {};
        setFormData({
          description: details.description || '',
          descriptionAm: details.descriptionAm || '',
          hours: details.hours || '',
          officeNumber: details.officeNumber || '',
          contactPhone: details.contactPhone || '',
          contactEmail: details.contactEmail || '',
          officerName: details.officerName || '',
          officerNameAm: details.officerNameAm || '',
          officerRole: details.officerRole || '',
          officerRoleAm: details.officerRoleAm || '',
          officerPhoto: details.officerPhoto || '',
          bannerPhoto: details.bannerPhoto || '',
          additionalDetails: details.additionalDetails || '',
          additionalDetailsAm: details.additionalDetailsAm || '',
          requirements: Array.isArray(details.requirements) 
            ? details.requirements 
            : (details.requirements ? [details.requirements] : []),
          requirementsAm: Array.isArray(details.requirementsAm) 
            ? details.requirementsAm 
            : (details.requirementsAm ? [details.requirementsAm] : [])
        });
        setShowForm(true);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [selectedService]);

  const handleRequirementChange = (index, value, isAmharic = false) => {
    if (isAmharic) {
      const updated = [...(formData.requirementsAm || [])];
      updated[index] = value;
      setFormData({ ...formData, requirementsAm: updated });
    } else {
      const updated = [...formData.requirements];
      updated[index] = value;
      setFormData({ ...formData, requirements: updated });
    }
  };

  const addRequirement = () => {
    setFormData({ 
      ...formData, 
      requirements: [...formData.requirements, ''],
      requirementsAm: [...(formData.requirementsAm || []), '']
    });
  };

  const removeRequirement = (index) => {
    const updatedReq = [...formData.requirements];
    const updatedReqAm = [...(formData.requirementsAm || [])];
    updatedReq.splice(index, 1);
    updatedReqAm.splice(index, 1);
    setFormData({ 
      ...formData, 
      requirements: updatedReq,
      requirementsAm: updatedReqAm
    });
  };

  const deleteServiceDetails = async () => {
    if (!selectedService) return;
    if (!confirm('Are you sure you want to delete all details for this service? This action cannot be undone.')) return;
    
    try {
      const res = await fetch(`http://localhost:5000/api/service-details/${selectedService.id}`, {
        method: 'DELETE'
      });
      
      if (res.ok) {
        alert('Service details deleted successfully!');
        setFormData(null);
        setSelectedService(null);
        setShowForm(false);
      } else {
        const errorData = await res.json();
        alert(`Failed to delete service details: ${errorData.msg || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Network error. Could not delete service details. Please check if the backend is running.');
    }
  };

  const clearOfficerPhoto = () => {
    setFormData({ ...formData, officerPhoto: '' });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('image', file);

    try {
      const res = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: data,
      });

      if (res.ok) {
        const result = await res.json();
        setFormData({ ...formData, officerPhoto: result.url });
      } else {
        alert('Failed to upload image.');
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading image.');
    }
  };

  const handleBannerUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('image', file);

    try {
      const res = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: data,
      });

      if (res.ok) {
        const result = await res.json();
        setFormData({ ...formData, bannerPhoto: result.url });
      } else {
        alert('Failed to upload banner image.');
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading banner image.');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!selectedService || !formData) return;

    setSaving(true);
    try {
      const res = await fetch(`http://localhost:5000/api/service-details/${selectedService.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        alert('Service details saved successfully!');
      } else {
        const errorData = await res.json();
        alert(`Failed to save: ${errorData.msg}`);
      }
    } catch (err) {
      console.error(err);
      alert('Network Error. Could not save details.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-slate-100 pb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tighter">Service Details</h2>
          <p className="mt-1 text-sm text-slate-400 font-bold uppercase tracking-widest">Manage description, requirements, and contact details</p>
        </div>
        {selectedService && (
          <button 
            onClick={() => {
              setSelectedService(null);
              setShowForm(false);
              setFormData(null);
            }}
            className="flex items-center px-6 py-3 bg-slate-500 text-white text-sm font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-slate-500/30 hover:bg-slate-600 hover:-translate-y-0.5 transition-all"
          >
            ← Back to Services
          </button>
        )}
      </div>

      {!selectedService && (
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/40 border border-slate-100 p-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <input 
                type="text" 
                placeholder="Search services..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/20 focus:border-[#00B4D8] transition-all"
              />
            </div>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 animate-in slide-in-from-bottom-4 duration-500">
            {services.filter(service => 
                service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                service.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                service.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (service.titleAm && service.titleAm.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (service.departmentAm && service.departmentAm.toLowerCase().includes(searchTerm.toLowerCase()))
              ).length === 0 ? (
               <div className="col-span-full py-16 text-center text-slate-300 font-black uppercase tracking-widest">
                 {searchTerm ? 'No services found matching your search' : 'No services available'}
               </div>
            ) : services.filter(service => 
                service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                service.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                service.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (service.titleAm && service.titleAm.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (service.departmentAm && service.departmentAm.toLowerCase().includes(searchTerm.toLowerCase()))
              ).map((service) => (
              <div 
                key={service.id} 
                onClick={() => setSelectedService(service)}
                className="bg-white border border-slate-100 rounded-2xl p-4 hover:shadow-lg hover:shadow-[#00B4D8]/10 hover:border-[#00B4D8]/40 transition-all group relative overflow-hidden cursor-pointer"
              >
                {service.isPopular && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                    <Star className="w-3 h-3 text-white fill-white" />
                  </div>
                )}
                <div className="flex justify-between items-start mb-3">
                  <div className="w-8 h-8 rounded-xl bg-[#90E0EF]/20 text-[#00B4D8] flex items-center justify-center border border-[#90E0EF]/30 group-hover:bg-[#00B4D8] group-hover:text-white transition-all duration-300">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-black px-2 py-1 rounded-full bg-slate-50 text-slate-400 border border-slate-100 group-hover:bg-[#0077B6] group-hover:text-white group-hover:border-[#0077B6] transition-all">
                    {service.category}
                  </span>
                </div>
                <h3 className="font-extrabold text-slate-800 text-sm tracking-tighter group-hover:text-[#00B4D8] transition-colors mb-1">{service.title}</h3>
                <p className="text-[10px] text-slate-400 font-medium mb-4 line-clamp-2">{service.department}</p>
                
                <div className="flex border-t border-slate-50 pt-3 justify-center">
                  <span className="text-[9px] font-black text-[#00B4D8] uppercase tracking-widest group-hover:text-[#0077B6] transition-colors">
                    Click to manage details →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedService && (
        <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/40 border border-slate-100 p-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#90E0EF]/20 text-[#00B4D8] flex items-center justify-center border border-[#90E0EF]/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-800 text-lg">{selectedService.title}</h3>
              <p className="text-sm text-slate-500">{selectedService.department} • {selectedService.category}</p>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="py-20 text-center animate-pulse">
           <p className="text-xl font-black text-slate-300 uppercase tracking-widest">Loading Details...</p>
        </div>
      )}

      {!loading && showForm && formData && (
        <form onSubmit={handleSave} className="space-y-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Overview & Operations */}
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 p-8 space-y-6 lg:row-span-2">
              <div className="flex items-center gap-3 border-b border-slate-50 pb-4 mb-2">
                <div className="w-10 h-10 bg-[#90E0EF]/20 text-[#00B4D8] rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-slate-800 text-lg">General Information</h3>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 ml-1">Overview Description (English)</label>
                  <textarea 
                    rows="4"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/20 focus:border-[#00B4D8] transition-all"
                    placeholder="Full description of the service and its benefits..."
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 ml-1 text-brand">Overview Description (Amharic)</label>
                  <textarea 
                    rows="4"
                    value={formData.descriptionAm}
                    onChange={(e) => setFormData({...formData, descriptionAm: e.target.value})}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/20 focus:border-[#00B4D8] transition-all"
                    placeholder="ስለ አገልግሎቱ እና ጥቅሞቹ አጠቃላይ መግለጫ..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 ml-1">Banner Graphic Upload (Optional)</label>
                <div className="flex items-center gap-4">
                  {formData.bannerPhoto && (
                    <div className="relative">
                      <img src={formData.bannerPhoto} alt="Banner Preview" className="w-24 h-12 rounded-lg object-cover border-2 border-[#00B4D8]" />
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, bannerPhoto: ''})}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-all"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  <input 
                    type="file"
                    accept="image/*"
                    onChange={handleBannerUpload}
                    className="flex-1 px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/20 focus:border-[#00B4D8] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#90E0EF]/30 file:text-[#0077B6] hover:file:bg-[#00B4D8] hover:file:text-white transition-all cursor-pointer"
                  />
                </div>
                {!formData.bannerPhoto && (
                  <p className="text-[9px] text-slate-400 mt-2 ml-1">No banner image uploaded. This field is optional.</p>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] flex items-center gap-1.5 font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 ml-1">
                    <Clock className="w-3 h-3" /> Working Hours
                  </label>
                  <input 
                    type="text"
                    value={formData.hours}
                    onChange={(e) => setFormData({...formData, hours: e.target.value})}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/20 focus:border-[#00B4D8] transition-all"
                    placeholder="Mon-Fri 8:30 AM - 5:00 PM"
                  />
                </div>
                <div>
                  <label className="block text-[10px] flex items-center gap-1.5 font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 ml-1">
                    <MapPin className="w-3 h-3" /> Office Location/Number
                  </label>
                  <input 
                    type="text"
                    value={formData.officeNumber}
                    onChange={(e) => setFormData({...formData, officeNumber: e.target.value})}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/20 focus:border-[#00B4D8] transition-all"
                    placeholder="e.g. Office 204"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] flex items-center gap-1.5 font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 ml-1">
                    <PhoneCall className="w-3 h-3" /> Contact Phone
                  </label>
                  <input 
                    type="text"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/20 focus:border-[#00B4D8] transition-all"
                    placeholder="+251 11 ..."
                  />
                </div>
                <div>
                  <label className="block text-[10px] flex items-center gap-1.5 font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 ml-1">
                    <Mail className="w-3 h-3" /> Contact Email
                  </label>
                  <input 
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/20 focus:border-[#00B4D8] transition-all"
                    placeholder="support@..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 ml-1">Additional Details (English)</label>
                  <textarea 
                    rows="3"
                    value={formData.additionalDetails}
                    onChange={(e) => setFormData({...formData, additionalDetails: e.target.value})}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/20 focus:border-[#00B4D8] transition-all"
                    placeholder="Extra footnotes, disclaimers, or notices..."
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 ml-1 text-brand">Additional Details (Amharic)</label>
                  <textarea 
                    rows="3"
                    value={formData.additionalDetailsAm}
                    onChange={(e) => setFormData({...formData, additionalDetailsAm: e.target.value})}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/20 focus:border-[#00B4D8] transition-all"
                    placeholder="ተጨማሪ የግርጌ ማስታወሻዎች ወይም መመሪያዎች..."
                  />
                </div>
              </div>

            </div>

            {/* Officer Details */}
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 p-8 space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-50 pb-4 mb-2">
                <div className="w-10 h-10 bg-[#90E0EF]/20 text-[#00B4D8] rounded-xl flex items-center justify-center">
                  <UserIcon className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-slate-800 text-lg">Staff Member</h3>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 ml-1">Officer Name (English)</label>
                    <input 
                      type="text"
                      value={formData.officerName}
                      onChange={(e) => setFormData({...formData, officerName: e.target.value})}
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/20 focus:border-[#00B4D8]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 ml-1 text-brand">Officer Name (Amharic)</label>
                    <input 
                      type="text"
                      value={formData.officerNameAm}
                      onChange={(e) => setFormData({...formData, officerNameAm: e.target.value})}
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/20 focus:border-[#00B4D8]"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 ml-1">Officer Role (English)</label>
                    <input 
                      type="text"
                      value={formData.officerRole}
                      onChange={(e) => setFormData({...formData, officerRole: e.target.value})}
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/20 focus:border-[#00B4D8]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 ml-1 text-brand">Officer Role (Amharic)</label>
                    <input 
                      type="text"
                      value={formData.officerRoleAm}
                      onChange={(e) => setFormData({...formData, officerRoleAm: e.target.value})}
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/20 focus:border-[#00B4D8]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 ml-1">Officer Photo upload</label>
                  <div className="flex items-center gap-4">
                    {formData.officerPhoto && (
                      <div className="relative">
                        <img src={formData.officerPhoto} alt="Preview" className="w-12 h-12 rounded-lg object-cover border-2 border-[#00B4D8]" />
                        <button
                          type="button"
                          onClick={clearOfficerPhoto}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-all"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="flex-1 px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/20 focus:border-[#00B4D8] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#90E0EF]/30 file:text-[#0077B6] hover:file:bg-[#00B4D8] hover:file:text-white transition-all cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Requirements Array */}
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-50 pb-4 mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#90E0EF]/20 text-[#00B4D8] rounded-xl flex items-center justify-center">
                    <Building className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-slate-800 text-lg">Service Requirements</h3>
                </div>
                <button 
                  type="button" 
                  onClick={addRequirement}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-[#00B4D8] text-slate-400 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all"
                >
                  <Plus className="w-3 h-3" /> Add New
                </button>
              </div>

              <div className="space-y-3">
                {formData.requirements.length === 0 && (
                  <p className="text-sm text-slate-400 font-medium italic text-center py-4 bg-slate-50 rounded-xl">No specific requirements modeled.</p>
                )}
                {formData.requirements.map((req, index) => (
                  <div key={index} className="space-y-2 pb-4 border-b border-slate-50 last:border-0 group">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-black text-slate-300">REQUIREMENT {(index + 1).toString().padStart(2, '0')}</span>
                      <button 
                        type="button"
                        onClick={() => removeRequirement(index)}
                        className="p-1 text-slate-300 hover:text-red-500 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="grid gap-2">
                       <input 
                        type="text"
                        value={req}
                        onChange={(e) => handleRequirementChange(index, e.target.value, false)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#00B4D8]"
                        placeholder="English requirement rule..."
                      />
                      <input 
                        type="text"
                        value={formData.requirementsAm[index] || ''}
                        onChange={(e) => handleRequirementChange(index, e.target.value, true)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#0077B6] text-brand"
                        placeholder="አማርኛ አስፈላጊ ሰነዶች..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end pt-4 gap-3">
            <button 
              type="button"
              onClick={deleteServiceDetails}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-red-500 text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-red-500/30 hover:bg-red-600 hover:-translate-y-0.5 transition-all"
            >
              <Trash2 className="w-4 h-4" /> 
              Delete All Details
            </button>
            <button 
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 sm:px-10 py-4 bg-[#00B4D8] text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-[#00B4D8]/30 hover:bg-[#0077B6] hover:-translate-y-0.5 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" /> 
              {saving ? 'Saving...' : 'Save Details'}
            </button>
          </div>
        </form>
      )}

    </div>
  );
}
