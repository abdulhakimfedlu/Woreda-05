import React from 'react';
import { Users, FileText, Server, Image as ImageIcon, TrendingUp, TrendingDown, ArrowUpRight, Megaphone } from 'lucide-react';

export function Dashboard() {
  const stats = [
    { name: 'Total Announcements', value: '12', icon: FileText, change: '+2', changeType: 'increase', gradient: 'from-blue-500 to-brand' },
    { name: 'Active Services', value: '20', icon: Server, change: '+0', changeType: 'neutral', gradient: 'from-brand to-brand-light' },
    { name: 'Gallery Images', value: '45', icon: ImageIcon, change: '+5', changeType: 'increase', gradient: 'from-purple-500 to-indigo-500' },
    { name: 'Total Visitors', value: '1,234', icon: Users, change: '+12%', changeType: 'increase', gradient: 'from-emerald-400 to-teal-500' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Dashboard Overview</h2>
          <p className="mt-1.5 text-slate-500 font-medium">Welcome back, here's what's happening today in Woreda 05.</p>
        </div>
        <button className="flex items-center px-5 py-2.5 bg-white text-slate-700 font-medium rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-brand/30 transition-all group">
          Generate Report
          <ArrowUpRight className="w-4 h-4 ml-2 text-slate-400 group-hover:text-brand transition-colors" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={stat.name} className="glass-card-premium rounded-2xl p-6 relative overflow-hidden group" style={{ animationDelay: `${index * 100}ms` }}>
            {/* Background glow effect based on gradient */}
            <div className={`absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-[0.08] group-hover:opacity-15 blur-2xl rounded-full transition-opacity duration-500`}></div>
            
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                stat.changeType === 'increase' ? 'text-emerald-700 bg-emerald-50 border border-emerald-100' : 
                stat.changeType === 'decrease' ? 'text-red-700 bg-red-50 border border-red-100' : 
                'text-slate-600 bg-slate-100 border border-slate-200'
              }`}>
                {stat.changeType === 'increase' && <TrendingUp className="w-3.5 h-3.5 mr-1" />}
                {stat.changeType === 'decrease' && <TrendingDown className="w-3.5 h-3.5 mr-1" />}
                {stat.change}
              </div>
            </div>
            
            <div>
               <p className="text-sm font-semibold text-slate-500 mb-1">{stat.name}</p>
               <h3 className="text-3xl font-bold text-slate-800">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-panel rounded-3xl p-7 relative overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Recent Activity</h3>
            <button className="text-sm font-medium text-brand hover:text-brand-dark transition-colors">View All</button>
          </div>
          <div className="space-y-5">
             {[
               { title: "New announcement published", time: "2 hours ago", desc: "Road Maintenance Schedule", icon: Megaphone, color: "text-blue-500", bg: "bg-blue-50" },
               { title: "Service request updated", time: "5 hours ago", desc: "ID Card Issuance - Pending", icon: Server, color: "text-emerald-500", bg: "bg-emerald-50" },
               { title: "Gallery image uploaded", time: "1 day ago", desc: "Inauguration Ceremony", icon: ImageIcon, color: "text-purple-500", bg: "bg-purple-50" }
             ].map((item, i) => (
               <div key={i} className="flex gap-5 p-4 rounded-2xl hover:bg-slate-50/80 border border-transparent hover:border-slate-100 transition-all duration-300 cursor-pointer group">
                 <div className={`mt-0.5 w-12 h-12 rounded-2xl flex items-center justify-center ${item.bg} ${item.color} group-hover:scale-110 transition-transform`}>
                   <item.icon className="w-5 h-5" />
                 </div>
                 <div className="flex-1">
                   <div className="flex justify-between items-center mb-1">
                     <p className="text-sm font-bold text-slate-800">{item.title}</p>
                     <span className="text-xs font-semibold text-slate-400">{item.time}</span>
                   </div>
                   <p className="text-sm text-slate-500">{item.desc}</p>
                 </div>
               </div>
             ))}
          </div>
        </div>
        
        <div className="lg:col-span-1 glass-panel rounded-3xl p-7 flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-6">System Status</h3>
          <div className="flex-1 flex flex-col justify-center items-center text-center">
            <div className="relative mb-6">
              <div className="w-32 h-32 rounded-full border-[8px] border-emerald-50 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                  <span className="text-2xl font-bold">100%</span>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-4 h-4 bg-emerald-400 border-2 border-white rounded-full animate-ping"></div>
              <div className="absolute top-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
            </div>
            <h4 className="font-bold text-slate-800 mb-2">All Systems Operational</h4>
            <p className="text-sm text-slate-500 mb-6">Frontend and backend are responding quickly. Server load is normal.</p>
            <button className="w-full py-3 rounded-xl bg-slate-50 text-slate-700 font-semibold hover:bg-slate-100 transition-colors border border-slate-200">
              View Detailed Logs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
