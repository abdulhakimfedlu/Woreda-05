import React from 'react';
import { Link } from 'react-router-dom';
import abiyImg from '../assets/Abiy ahmed.jpg';
import adanechImg from '../assets/Adanech-Abiebie.png';
import liyaImg from '../assets/Dr Liya.jpg';
import Mekdes from '../assets/DR Mekdes Dabba_0.jpg';
import soldierImg from '../assets/Soldier.webp';
import tayeImg from '../assets/Taye.jpg';

const Hero = () => {
  return (
    <div className="relative bg-white pt-2 pb-16 lg:pt-4 lg:pb-32 overflow-hidden min-h-[calc(100vh-80px)] flex items-center">
      {/* High-End Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,rgba(0,180,216,0.08)_0%,transparent_40%)]"></div>
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#000 1.5px, transparent 1.5px)', backgroundSize: '60px 60px' }}></div>
      </div>

      {/* Strategic brand glows */}
      <div className="absolute top-1/2 -right-1/4 w-[1000px] h-[1000px] bg-brand/5 rounded-full blur-[150px] animate-pulse"></div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-12 gap-32 items-center">

          {/* Main Statement Content */}
          <div className="lg:col-span-6">
            <div className="inline-block px-6 py-2 rounded-full bg-brand/10 text-brand font-black text-[10px] uppercase tracking-[0.4em] mb-8">
              Modern Governance Excellence
            </div>

            <h1 className="text-6xl md:text-8xl font-black text-black leading-[0.9] mb-8 tracking-tighter">
              Welcome to <br />
              <span className="stylized-underline pb-4">Woreda 05</span> <br />
              <span className="text-black/30 block mt-6 leading-none">Yeka Subcity</span>
            </h1>

            <p className="text-xl md:text-2xl text-black/40 leading-tight max-w-xl mb-10 font-black uppercase tracking-tight">
              Transforming community service through innovative digital integration and transparent leadership.
            </p>

            <div>
              <Link
                to="/services"
                className="inline-block px-10 py-5 bg-white border-2 border-black text-black rounded-2xl font-black text-base shadow-xl hover:bg-brand hover:border-brand hover:text-white hover:-translate-y-1 hover:shadow-brand/30 transition-all duration-500 active:scale-95 leading-none"
              >
                Explore Services
              </Link>
            </div>
          </div>

          {/* 5-Photo Community Grid Section */}
          <div className="lg:col-span-6 relative h-[600px] flex items-center justify-center lg:-translate-x-24">
            <div className="relative w-full h-full flex items-center justify-center animate-float-calm">
              {/* Center Photo - Abiy Ahmed (On Top) */}
              <div className="relative z-30 w-72 h-72 shadow-2xl shadow-black/20 border-4 border-white overflow-hidden rounded-2xl shrink-0">
                <img src={abiyImg} alt="PM Abiy Ahmed" className="w-full h-full object-cover" />
              </div>

              {/* Corner Photos - Positioned underneath the center photo */}
              <div className="absolute z-10 w-52 h-52 shadow-xl border-4 border-white overflow-hidden rounded-2xl -translate-x-[11.2rem] -translate-y-[11.2rem]">
                <img src={adanechImg} alt="Mayor Adanech Abiebie" className="w-full h-full object-cover" />
              </div>
              <div className="absolute z-10 w-52 h-52 shadow-xl border-4 border-white overflow-hidden rounded-2xl translate-x-[11.2rem] -translate-y-[11.2rem]">
                <img src={tayeImg} alt="Lead Personnel" className="w-full h-full object-cover" />
              </div>
              <div className="absolute z-10 w-52 h-52 shadow-xl border-4 border-white overflow-hidden rounded-2xl -translate-x-[11.2rem] translate-y-[11.2rem]">
                <img src={soldierImg} alt="Personnel" className="w-full h-full object-cover" />
              </div>
              <div className="absolute z-10 w-52 h-52 shadow-xl border-4 border-white overflow-hidden rounded-2xl translate-x-[11.2rem] translate-y-[11.2rem]">
                <img src={Mekdes} alt="Dr. Mekdes Dabba" className="w-full h-full object-cover" />
              </div>

              {/* Atmospheric brand glow */}
              <div className="absolute inset-0 bg-brand/10 blur-[140px] -z-10 rounded-full"></div>
            </div>
          </div>




        </div>
      </div>
    </div>
  );
};

export default Hero;


