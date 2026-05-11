import React from 'react';
import { motion } from 'motion/react';
import { Car } from '../types';
import { cn } from '../lib/utils';
import { BadgeCheck, MapPin, Gauge } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CarCardProps {
  car: Car;
  index: number;
}

export const CarCard: React.FC<CarCardProps> = ({ car, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="card group cursor-pointer"
    >
      <Link to={`/car/${car.id}`}>
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={car.image}
            alt={`${car.make} ${car.model}`}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-4 left-4">
            <span className={cn(
              "badge",
              car.status === 'Available' ? 'badge-verified' : car.status === 'Pending' ? 'badge-pending' : 'badge-rejected'
            )}>
              {car.status}
            </span>
          </div>
          {car.sellerName === 'AutoVault Certified' && (
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-lg">
              <BadgeCheck size={18} className="text-accent-blue" />
            </div>
          )}
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-xs font-bold text-secondary-slate uppercase tracking-wider mb-1">
                {car.year} {car.make}
              </p>
              <h3 className="text-xl font-bold text-primary-navy leading-tight">
                {car.model}
              </h3>
            </div>
            <p className="text-xl font-extrabold text-primary-navy">
              ${car.price.toLocaleString()}
            </p>
          </div>

          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-surface-border">
            <div className="flex items-center gap-1.5 text-secondary-slate">
              <Gauge size={14} />
              <span className="text-xs font-medium">{car.mileage.toLocaleString()} mi</span>
            </div>
            <div className="flex items-center gap-1.5 text-secondary-slate">
              <MapPin size={14} />
              <span className="text-xs font-medium">{car.location.split(',')[0]}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
