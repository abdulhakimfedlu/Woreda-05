import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, FileText, User as UserIcon, Clock, MapPin, Building, PhoneCall, Mail } from 'lucide-react';

export function ServiceDetails() {
  const [services, setServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

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
    if (!selectedServiceId) {
      setFormData(null);
      return;
    }

    setLoading(true);
    fetch(`http://localhost:5000/api/service-details/${selectedServiceId}`)
      .then(res => res.json())
      .then(data => {
        const details = data.details || {};
        setFormData({
          description: details.description || '',
          hours: details.hours || '',
          officeNumber: details.officeNumber || '',
          contactPhone: details.contactPhone || '',
          contactEmail: details.contactEmail || '',
          officerName: details.officerName || '',
          officerRole: details.officerRole || '',
          officerPhoto: details.officerPhoto || '',
          additionalDetails: details.additionalDetails || '',
          requirements: Array.isArray(details.requirements) 
            ? details.requirements 
            : (details.requirements ? [details.requirements] : [])
        });
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [selectedServiceId]);

  const handleRequirementChange = (index, value) => {
    const updated = [...formData.requirements];
    updated[index] = value;
    setFormData({ ...formData, requirements: updated });
  };

  const addRequirement = () => {
    setFormData({ ...formData, requirements: [...formData.requirements, ''] });
  };

  const removeRequirement = (index) => {
    const updated = [...formData.requirements];
    updated.splice(index, 1);
    setFormData({ ...formData, requirements: updated });
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

  const handleSave = async (e) => {
    e.preventDefault();
    if (!selectedServiceId || !formData) return;

    setSaving(true);
    try {
      const res = await fetch(`http://localhost:5000/api/service-details/${selectedServiceId}`, {
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
          <h2 className="text-3xl font-black text-slate-800 tracking-tighter">Service Content Configurations</h2>
          <p className="mt-1 text-sm text-slate-400 font-bold uppercase tracking-widest">Manage rich data, requirements, and contact details</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 p-8">
        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Target Service Pipeline</label>
        <select 
          value={selectedServiceId}
          onChange={(e) => setSelectedServiceId(e.target.value)}
          className="w-full lg:w-1/2 px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/20 focus:border-[#00B4D8] focus:bg-white transition-all"
        >
          <option value="">-- Abstract a Service Network --</option>
          {services.map(s => (
            <option key={s.id} value={s.id}>{s.title} ({s.department})</option>
          ))}
        </select>
      </div>

      {loading && (
        <div className="py-20 text-center animate-pulse">
           <p className="text-xl font-black text-slate-300 uppercase tracking-widest">Resolving Details...</p>
        </div>
      )}

      {!loading && formData && (
        <form onSubmit={handleSave} className="space-y-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Overview & Operations */}
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 p-8 space-y-6 lg:row-span-2">
              <div className="flex items-center gap-3 border-b border-slate-50 pb-4 mb-2">
                <div className="w-10 h-10 bg-[#90E0EF]/20 text-[#00B4D8] rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-slate-800 text-lg">General Profile</h3>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 ml-1">Overview Description</label>
                <textarea 
                  rows="4"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/20 focus:border-[#00B4D8] transition-all"
                  placeholder="Comprehensive description of the service and its benefits..."
                />
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

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 ml-1">Additional Details</label>
                <textarea 
                  rows="3"
                  value={formData.additionalDetails}
                  onChange={(e) => setFormData({...formData, additionalDetails: e.target.value})}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/20 focus:border-[#00B4D8] transition-all"
                  placeholder="Extra footnotes, disclaimers, or notices..."
                />
              </div>

            </div>

            {/* Officer Details */}
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 p-8 space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-50 pb-4 mb-2">
                <div className="w-10 h-10 bg-[#90E0EF]/20 text-[#00B4D8] rounded-xl flex items-center justify-center">
                  <UserIcon className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-slate-800 text-lg">Operating Officer</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 ml-1">Officer Name</label>
                  <input 
                    type="text"
                    value={formData.officerName}
                    onChange={(e) => setFormData({...formData, officerName: e.target.value})}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/20 focus:border-[#00B4D8]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 ml-1">Officer Role / Title</label>
                  <input 
                    type="text"
                    value={formData.officerRole}
                    onChange={(e) => setFormData({...formData, officerRole: e.target.value})}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/20 focus:border-[#00B4D8]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 ml-1">Officer Photo upload</label>
                  <div className="flex items-center gap-4">
                    {formData.officerPhoto && (
                      <img src={formData.officerPhoto} alt="Preview" className="w-12 h-12 rounded-lg object-cover border-2 border-[#00B4D8]" />
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
                  <h3 className="font-extrabold text-slate-800 text-lg">Prerequisites</h3>
                </div>
                <button 
                  type="button" 
                  onClick={addRequirement}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-[#00B4D8] text-slate-400 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all"
                >
                  <Plus className="w-3 h-3" /> Append
                </button>
              </div>

              <div className="space-y-3">
                {formData.requirements.length === 0 && (
                  <p className="text-sm text-slate-400 font-medium italic text-center py-4 bg-slate-50 rounded-xl">No specific requirements modeled.</p>
                )}
                {formData.requirements.map((req, index) => (
                  <div key={index} className="flex gap-3 items-center group">
                    <span className="text-[10px] font-black text-slate-300">{(index + 1).toString().padStart(2, '0')}</span>
                    <input 
                      type="text"
                      value={req}
                      onChange={(e) => handleRequirementChange(index, e.target.value)}
                      className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#00B4D8]"
                      placeholder="Enter requirement rule..."
                    />
                    <button 
                      type="button"
                      onClick={() => removeRequirement(index)}
                      className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <div className="flex justify-end pt-4">
            <button 
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-10 py-4 bg-[#00B4D8] text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-[#00B4D8]/30 hover:bg-[#0077B6] hover:-translate-y-0.5 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" /> 
              {saving ? 'Synchronizing...' : 'Deploy Content Specifications'}
            </button>
          </div>
        </form>
      )}

    </div>
  );
}
