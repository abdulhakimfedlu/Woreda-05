import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Link, Filter, Image as ImageIcon, Edit2 } from 'lucide-react';
import { Modal } from '../components/Modal';

export function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    size: '0 MB'
  });

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/gallery');
      const data = await res.json();
      setImages(data);
    } catch (error) {
      console.error('Error fetching gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteImage = async (id) => {
    if(!confirm('Are you sure you want to delete this image?')) return;
    try {
      await fetch(`http://localhost:5000/api/gallery/${id}`, { method: 'DELETE' });
      fetchGallery();
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const handleEdit = (image) => {
    setEditingItem(image);
    setFormData({
      title: image.title,
      url: image.url,
      description: image.description || '',
      date: image.date || new Date().toISOString().split('T')[0],
      size: image.size || '0 MB'
    });
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit');
        e.target.value = null;
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    
    let currentUrl = formData.url;
    let currentSize = formData.size;

    try {
      // 1. If a new file is selected, upload it first
      if (selectedFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('image', selectedFile);
        
        const uploadRes = await fetch('http://localhost:5000/api/upload', {
          method: 'POST',
          body: uploadFormData
        });
        
        if (!uploadRes.ok) throw new Error('Upload failed');
        const uploadData = await uploadRes.json();
        currentUrl = uploadData.url;
        currentSize = uploadData.size;
      }

      // 2. Save/Update metadata
      const url = editingItem 
        ? `http://localhost:5000/api/gallery/${editingItem.id}`
        : 'http://localhost:5000/api/gallery';
      const method = editingItem ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          url: currentUrl,
          size: currentSize
        })
      });

      if (res.ok) {
        setIsModalOpen(false);
        setEditingItem(null);
        setSelectedFile(null);
        setFormData({ title: '', url: '', description: '', date: new Date().toISOString().split('T')[0], size: '0 MB' });
        fetchGallery();
      }
    } catch (error) {
      console.error('Error saving gallery item:', error);
      alert('Failed to save gallery item');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-100 pb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tighter">Media Gallery</h2>
          <p className="mt-1 text-sm text-slate-400 font-bold uppercase tracking-widest">Visual Assets & Community Documentation</p>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center px-6 py-3 bg-white text-slate-500 text-sm font-black uppercase tracking-widest rounded-2xl border border-slate-200 shadow-sm hover:bg-slate-50 hover:text-[#00B4D8] transition-all">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
          <button 
            onClick={() => {
              setEditingItem(null);
              setFormData({ title: '', url: '', description: '', date: new Date().toISOString().split('T')[0], size: '0 MB' });
              setSelectedFile(null);
              setIsModalOpen(true);
            }}
            className="flex-1 sm:flex-none flex items-center justify-center px-6 py-3 bg-[#00B4D8] text-white text-sm font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-[#00B4D8]/30 hover:bg-[#0077B6] hover:-translate-y-0.5 transition-all"
          >
            <Plus className="w-5 h-5 mr-1" />
            Add Media
          </button>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => {
          if(!uploading) {
            setIsModalOpen(false);
            setEditingItem(null);
          }
        }} 
        title={editingItem ? "Update Media Details" : "Upload New Media"}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 ml-1">Asset Title</label>
              <input 
                required
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="e.g. Community Cleanup Day"
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/20 focus:border-[#00B4D8] focus:bg-white transition-all"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-6">
               <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 ml-1">Event Date</label>
                  <input 
                    required
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/20 focus:border-[#00B4D8] focus:bg-white transition-all"
                  />
               </div>
               <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 ml-1">Source File (Max 5MB)</label>
                  <div className="relative group">
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium flex items-center text-slate-400 group-hover:border-[#00B4D8] transition-all">
                       <ImageIcon className="w-4 h-4 mr-2" />
                       <span className="truncate">{selectedFile ? selectedFile.name : (editingItem ? "Keep current file" : "Select image...")}</span>
                    </div>
                  </div>
               </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 ml-1">Description</label>
              <textarea 
                rows="3"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Briefly describe this media asset..."
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/20 focus:border-[#00B4D8] focus:bg-white transition-all resize-none"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={uploading}
            className={`w-full py-4 mt-4 text-white font-black text-xs uppercase tracking-[0.3em] rounded-2xl shadow-xl transition-all flex items-center justify-center ${
              uploading ? 'bg-slate-400 cursor-not-allowed shadow-none' : 'bg-[#00B4D8] shadow-[#00B4D8]/20 hover:bg-[#0077B6] hover:shadow-[#00B4D8]/30'
            }`}
          >
            {uploading ? 'Synchronizing File...' : (editingItem ? "Update Asset" : "Engage Upload")}
          </button>
        </form>
      </Modal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div 
          onClick={() => {
            setEditingItem(null);
            setFormData({ title: '', url: '', description: '', date: new Date().toISOString().split('T')[0], size: '0 MB' });
            setSelectedFile(null);
            setIsModalOpen(true);
          }}
          className="bg-white border-2 border-dashed border-slate-200 hover:border-[#00B4D8] hover:bg-[#90E0EF]/5 hover:shadow-2xl hover:shadow-[#00B4D8]/10 transition-all duration-500 rounded-3xl flex flex-col items-center justify-center min-h-[280px] cursor-pointer text-slate-400 hover:text-[#00B4D8] group"
        >
           <div className="w-16 h-16 rounded-3xl bg-white shadow-lg border border-slate-100 group-hover:bg-[#00B4D8] group-hover:text-white group-hover:border-[#00B4D8] flex items-center justify-center mb-4 transition-all duration-500">
              <Plus className="w-8 h-8" />
           </div>
           <span className="font-black text-xs text-slate-600 group-hover:text-[#00B4D8] transition-colors uppercase tracking-widest">Add New Asset</span>
           <span className="text-[10px] mt-2 text-slate-300 font-black uppercase tracking-[0.2em]">Scale: 5MB Max</span>
        </div>

        {loading ? (
           <div className="col-span-full py-24 text-center text-slate-300 font-black uppercase tracking-widest animate-pulse">Synchronizing Visual Assets...</div>
        ) : images.map((image) => (
          <div key={image.id} className="bg-white border border-slate-100 rounded-3xl overflow-hidden group hover:shadow-2xl hover:shadow-[#00B4D8]/20 hover:-translate-y-2 transition-all duration-500 shadow-xl shadow-slate-200/40 relative">
            <div className="aspect-[4/3] relative overflow-hidden bg-slate-900 flex items-center justify-center">
              <img 
                src={image.url} 
                alt={image.title} 
                className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110 opacity-90 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-between p-5">
                 <div className="flex justify-end w-full gap-2">
                    <button 
                      onClick={() => handleEdit(image)}
                      className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white hover:text-[#0077B6] transition-all shadow-lg scale-0 group-hover:scale-100 duration-300 delay-75"
                    >
                       <Edit2 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => deleteImage(image.id)} 
                      className="w-10 h-10 rounded-xl bg-red-500/80 backdrop-blur-md text-white flex items-center justify-center hover:bg-red-600 transition-all shadow-lg scale-0 group-hover:scale-100 duration-300 delay-150"
                    >
                       <Trash2 className="w-5 h-5" />
                    </button>
                 </div>
                 <div className="flex justify-between items-end w-full translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <button className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest flex items-center hover:bg-white hover:text-slate-900 transition-all">
                       <Link className="w-3.5 h-3.5 mr-2" />
                       Link
                    </button>
                    <span className="text-white text-[10px] font-black bg-[#00B4D8]/80 px-2.5 py-1 rounded-lg backdrop-blur-md shadow-lg">{image.size}</span>
                 </div>
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                 <span className="text-[9px] font-black px-2 py-0.5 rounded-md bg-slate-50 text-slate-400 uppercase tracking-widest border border-slate-100">
                    {image.date || "No Date"}
                 </span>
              </div>
              <h3 className="font-black text-slate-800 text-sm tracking-tight truncate">{image.title}</h3>
              <p className="text-[10px] text-slate-400 font-medium line-clamp-1 mt-1">{image.description || "No description provided."}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
