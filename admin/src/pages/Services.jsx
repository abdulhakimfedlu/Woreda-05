import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Settings, FileText } from 'lucide-react';
import { Modal } from '../components/Modal';

export function Services() {
  const [activeTab, setActiveTab] = useState('list');
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Service Modal State
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceFormData, setServiceFormData] = useState({
    title: '',
    titleAm: '',
    department: '',
    departmentAm: '',
    category: ''
  });

  // Category Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    nameAm: '',
    description: '',
    descriptionAm: '',
    categoryNumber: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [servicesRes, categoriesRes] = await Promise.all([
        fetch('http://localhost:5000/api/services'),
        fetch('http://localhost:5000/api/categories')
      ]);
      const servicesData = await servicesRes.json();
      const categoriesData = await categoriesRes.json();
      setServices(servicesData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteService = async (id) => {
    if(!confirm('Are you sure you want to delete this service?')) return;
    try {
      await fetch(`http://localhost:5000/api/services/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  const deleteCategory = async (id) => {
    if(!confirm('Are you sure you want to delete this category? Services using this category name will remain.')) return;
    try {
      await fetch(`http://localhost:5000/api/categories/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setServiceFormData({
      title: service.title,
      titleAm: service.titleAm || '',
      department: service.department,
      departmentAm: service.departmentAm || '',
      category: service.category
    });
    setIsServiceModalOpen(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryFormData({
      name: category.name,
      nameAm: category.nameAm || '',
      description: category.description || '',
      descriptionAm: category.descriptionAm || '',
      categoryNumber: category.categoryNumber || ''
    });
    setIsCategoryModalOpen(true);
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    const url = editingService 
      ? `http://localhost:5000/api/services/${editingService.id}`
      : 'http://localhost:5000/api/services';
    const method = editingService ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serviceFormData)
      });
      if (res.ok) {
        setIsServiceModalOpen(false);
        setEditingService(null);
        setServiceFormData({ title: '', titleAm: '', department: '', departmentAm: '', category: '' });
        fetchData();
        alert(editingService ? 'Service updated successfully!' : 'New service initialized successfully!');
      } else {
        const errorData = await res.json();
        alert(`Failed to save: ${errorData.msg || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error saving service:', error);
      alert('Internal Server Error. Please check if the backend is running.');
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    const url = editingCategory 
      ? `http://localhost:5000/api/categories/${editingCategory.id}`
      : 'http://localhost:5000/api/categories';
    const method = editingCategory ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryFormData)
      });
      if (res.ok) {
        setIsCategoryModalOpen(false);
        setEditingCategory(null);
        setCategoryFormData({ name: '', nameAm: '', description: '', descriptionAm: '', categoryNumber: '' });
        fetchData();
        alert(editingCategory ? 'Category updated successfully!' : 'New category created successfully!');
      } else {
        const errorData = await res.json();
        alert(`Failed to save: ${errorData.msg || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Internal Server Error. Please check if the backend is running.');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-slate-100 pb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tighter">Services</h2>
          <p className="mt-1 text-sm text-slate-400 font-bold uppercase tracking-widest">Manage community services</p>
        </div>
        <button 
          onClick={() => {
            if (activeTab === 'list') {
              setEditingService(null);
              setServiceFormData({ title: '', titleAm: '', department: '', departmentAm: '', category: '' });
              setIsServiceModalOpen(true);
            } else {
              setEditingCategory(null);
              setCategoryFormData({ name: '', nameAm: '', description: '', descriptionAm: '', categoryNumber: '' });
              setIsCategoryModalOpen(true);
            }
          }}
          className="flex items-center px-6 py-3 bg-[#00B4D8] text-white text-sm font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-[#00B4D8]/30 hover:bg-[#0077B6] hover:-translate-y-0.5 transition-all"
        >
          <Plus className="w-5 h-5 mr-2" /> 
          {activeTab === 'list' ? 'Add Service' : 'Add Category'}
        </button>
      </div>

      <div className="flex items-center gap-2 mb-6 bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200/50 overflow-x-auto">
          <button 
          onClick={() => setActiveTab('list')}
          className={`px-4 sm:px-6 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all whitespace-nowrap ${activeTab === 'list' ? 'bg-white text-[#0077B6] shadow-md shadow-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
        >
          All Services
        </button>
        <button 
          onClick={() => setActiveTab('categories')}
          className={`px-4 sm:px-6 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all whitespace-nowrap ${activeTab === 'categories' ? 'bg-white text-[#0077B6] shadow-md shadow-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Service Categories
        </button>
      </div>

      {/* Service Modal */}
      <Modal 
        isOpen={isServiceModalOpen} 
        onClose={() => {
          setIsServiceModalOpen(false);
          setEditingService(null);
        }} 
        title={editingService ? "Update Service Details" : "Register New Service"}
      >
        <form onSubmit={handleServiceSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 ml-1">Service Title (English)</label>
              <input 
                required
                type="text"
                value={serviceFormData.title}
                onChange={(e) => setServiceFormData({...serviceFormData, title: e.target.value})}
                placeholder="e.g. Birth Certificate"
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/20 focus:border-[#00B4D8] focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 ml-1 text-brand">Service Title (Amharic)</label>
              <input 
                type="text"
                value={serviceFormData.titleAm}
                onChange={(e) => setServiceFormData({...serviceFormData, titleAm: e.target.value})}
                placeholder="ለምሳሌ፡ የልደት ምስክር ወረቀት"
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/20 focus:border-[#00B4D8] focus:bg-white transition-all"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 ml-1">Department (English)</label>
              <input 
                required
                type="text"
                value={serviceFormData.department}
                onChange={(e) => setServiceFormData({...serviceFormData, department: e.target.value})}
                placeholder="e.g. Civil Registry"
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/20 focus:border-[#00B4D8] focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 ml-1 text-brand">Department (Amharic)</label>
              <input 
                type="text"
                value={serviceFormData.departmentAm}
                onChange={(e) => setServiceFormData({...serviceFormData, departmentAm: e.target.value})}
                placeholder="ለምሳሌ፡ የሲቪል መዝገብ"
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/20 focus:border-[#00B4D8] focus:bg-white transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 ml-1">Category</label>
            <select 
              required
              value={serviceFormData.category}
              onChange={(e) => setServiceFormData({...serviceFormData, category: e.target.value})}
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/20 focus:border-[#00B4D8] focus:bg-white transition-all"
            >
              <option value="" disabled>Select a Category...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>
          <button 
            type="submit"
            className="w-full py-4 mt-4 bg-[#00B4D8] text-white font-black text-xs uppercase tracking-[0.3em] rounded-2xl shadow-xl shadow-[#00B4D8]/20 hover:bg-[#0077B6] hover:shadow-[#00B4D8]/30 transition-all"
          >
            {editingService ? "Save Service Changes" : "Create Service"}
          </button>
        </form>
      </Modal>

      {/* Category Modal */}
      <Modal 
        isOpen={isCategoryModalOpen} 
        onClose={() => {
          setIsCategoryModalOpen(false);
          setEditingCategory(null);
        }} 
        title={editingCategory ? "Update Category Details" : "Register New Category"}
      >
        <form onSubmit={handleCategorySubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 ml-1">Category Name (English)</label>
              <input 
                required
                type="text"
                value={categoryFormData.name}
                onChange={(e) => setCategoryFormData({...categoryFormData, name: e.target.value})}
                placeholder="e.g. Documentation"
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/20 focus:border-[#00B4D8] focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 ml-1 text-brand">Category Name (Amharic)</label>
              <input 
                type="text"
                value={categoryFormData.nameAm}
                onChange={(e) => setCategoryFormData({...categoryFormData, nameAm: e.target.value})}
                placeholder="ለምሳሌ፡ ሰነዶች"
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/20 focus:border-[#00B4D8] focus:bg-white transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 ml-1">Category Number (Order)</label>
            <input 
              type="number"
              value={categoryFormData.categoryNumber}
              onChange={(e) => setCategoryFormData({...categoryFormData, categoryNumber: e.target.value})}
              placeholder="e.g. 1"
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/20 focus:border-[#00B4D8] focus:bg-white transition-all"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 ml-1">Description (English)</label>
            <textarea 
              rows="3"
              value={categoryFormData.description}
              onChange={(e) => setCategoryFormData({...categoryFormData, description: e.target.value})}
              placeholder="Brief description of this service category..."
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/20 focus:border-[#00B4D8] focus:bg-white transition-all resize-none"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 ml-1 text-brand">Description (Amharic)</label>
            <textarea 
              rows="3"
              value={categoryFormData.descriptionAm}
              onChange={(e) => setCategoryFormData({...categoryFormData, descriptionAm: e.target.value})}
              placeholder="ስለዚህ አገልግሎት ምድብ አጭር መግለጫ..."
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/20 focus:border-[#00B4D8] focus:bg-white transition-all resize-none"
            />
          </div>
          <button 
            type="submit"
            className="w-full py-4 mt-4 bg-[#00B4D8] text-white font-black text-xs uppercase tracking-[0.3em] rounded-2xl shadow-xl shadow-[#00B4D8]/20 hover:bg-[#0077B6] hover:shadow-[#00B4D8]/30 transition-all"
          >
            {editingCategory ? "Save Category Changes" : "Create Category"}
          </button>
        </form>
      </Modal>

      {activeTab === 'list' && (
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
          {/* ... existing search header remains conceptually the same, just simplified without search logic for brevity or keeping existing search layout ... */}
          <div className="p-4 sm:p-6 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-50/30">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <input 
                type="text" 
                placeholder="Search services..." 
                className="w-full pl-12 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/20 focus:border-[#00B4D8] transition-all"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  <th className="px-8 py-5">Service Name</th>
                  <th className="px-8 py-5 w-56">Department</th>
                  <th className="px-8 py-5 w-48">Category</th>
                  <th className="px-8 py-5 w-32 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr><td colSpan="4" className="text-center py-12 text-slate-300 font-black uppercase tracking-widest animate-pulse">Loading...</td></tr>
                ) : services.length === 0 ? (
                   <tr><td colSpan="4" className="text-center py-12 text-slate-300 font-bold">No services found in the list</td></tr>
                ) : services.map((service) => (
                  <tr key={service.id} className="hover:bg-slate-50/50 transition-all group">
                    <td className="px-8 py-6">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 bg-[#90E0EF]/20 text-[#0077B6] border border-[#90E0EF]/30`}>
                          <FileText className="w-5 h-5" />
                        </div>
                        <p className="font-black text-slate-800 text-sm tracking-tight">{service.title}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[10px] font-black text-slate-500 bg-slate-100/80 border border-slate-200 px-3 py-1 rounded-full uppercase tracking-tighter">
                        {service.department}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[10px] font-black text-[#0077B6] bg-[#90E0EF]/30 px-3 py-1 rounded-full uppercase tracking-widest border border-[#90E0EF]/50">
                        {service.category}
                      </span>
                    </td>
                    <td className="px-4 sm:px-8 py-6">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEditService(service)}
                          className="p-2 text-slate-400 hover:text-[#00B4D8] hover:bg-[#90E0EF]/20 rounded-xl transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteService(service.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500">
          {loading ? (
            <div className="col-span-full py-24 text-center text-slate-300 font-black uppercase tracking-widest animate-pulse">Loading...</div>
          ) : categories.length === 0 ? (
             <div className="col-span-full py-24 text-center text-slate-300 font-black uppercase tracking-widest">No categories found in the system</div>
          ) : categories.map((cat) => {
            const serviceCount = services.filter(s => s.category === cat.name).length;
            return (
            <div key={cat.id} className="bg-white border border-slate-100 rounded-3xl p-8 hover:shadow-2xl hover:shadow-[#00B4D8]/10 hover:border-[#00B4D8]/40 transition-all group relative overflow-hidden">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#90E0EF]/20 text-[#00B4D8] flex items-center justify-center border border-[#90E0EF]/30 group-hover:bg-[#00B4D8] group-hover:text-white transition-all duration-300">
                  <span className="font-black text-lg">{cat.categoryNumber || 0}</span>
                </div>
                <span className="text-[10px] font-black px-3 py-1 rounded-full bg-slate-50 text-slate-400 border border-slate-100 group-hover:bg-[#0077B6] group-hover:text-white group-hover:border-[#0077B6] transition-all">
                  {serviceCount} Services
                </span>
              </div>
              <h3 className="font-extrabold text-slate-800 text-xl tracking-tighter group-hover:text-[#00B4D8] transition-colors">{cat.name}</h3>
              <p className="text-xs text-slate-400 font-medium mt-1 mb-8">{cat.description || "Categories used for grouping community services."}</p>
              
              <div className="flex border-t border-slate-50 pt-6 gap-2 justify-between">
                <button 
                  onClick={() => handleEditCategory(cat)}
                  className="text-[10px] font-black text-[#00B4D8] uppercase tracking-widest hover:text-[#0077B6] transition-colors flex items-center p-2 hover:bg-slate-50 rounded-lg">
                   <Edit2 className="w-3 h-3 mr-1.5" /> Edit Category
                </button>
                <button 
                  onClick={() => deleteCategory(cat.id)}
                  className="text-[10px] font-black text-red-400 uppercase tracking-widest hover:text-red-600 transition-colors flex items-center p-2 hover:bg-red-50 rounded-lg">
                   <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
