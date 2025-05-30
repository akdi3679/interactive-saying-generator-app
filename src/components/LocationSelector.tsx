
import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface LocationSelectorProps {
  selectedLocation: {
    lat: number;
    lng: number;
    address: string;
    range: number;
  };
  onLocationChange: (location: any) => void;
}

const LocationSelector = ({ selectedLocation, onLocationChange }: LocationSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [tempLocation, setTempLocation] = useState(selectedLocation);
  const [range, setRange] = useState(selectedLocation.range);
  const mapRef = useRef(null);

  const mockLocations = [
    { address: 'New York, NY', lat: 40.7128, lng: -74.0060 },
    { address: 'Los Angeles, CA', lat: 34.0522, lng: -118.2437 },
    { address: 'Chicago, IL', lat: 41.8781, lng: -87.6298 },
    { address: 'Houston, TX', lat: 29.7604, lng: -95.3698 },
    { address: 'Phoenix, AZ', lat: 33.4484, lng: -112.0740 },
    { address: 'Philadelphia, PA', lat: 39.9526, lng: -75.1652 },
    { address: 'San Antonio, TX', lat: 29.4241, lng: -98.4936 },
    { address: 'San Diego, CA', lat: 32.7157, lng: -117.1611 },
    { address: 'Dallas, TX', lat: 32.7767, lng: -96.7970 },
    { address: 'San Jose, CA', lat: 37.3382, lng: -121.8863 }
  ];

  const filteredLocations = mockLocations.filter(loc =>
    loc.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLocationSelect = (location: any) => {
    setTempLocation(location);
    setSearchQuery('');
  };

  const handleRangeChange = (newRange: number) => {
    setRange(newRange);
  };

  const handleApply = () => {
    onLocationChange({ ...tempLocation, range });
    setIsOpen(false);
  };

  const getShortAddress = (address: string) => {
    return address.split(',')[0];
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border cursor-pointer hover:bg-gray-100 transition-colors">
          <MapPin className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-700 max-w-20 truncate">
            {getShortAddress(selectedLocation.address)}
          </span>
          <span className="text-xs bg-[#3665f3] text-white px-2 py-1 rounded">
            {selectedLocation.range}mi
          </span>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Select Location & Range</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search for a location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {searchQuery && (
            <div className="max-h-40 overflow-y-auto border rounded-md">
              {filteredLocations.map((location, index) => (
                <button
                  key={index}
                  className="w-full text-left p-3 hover:bg-gray-50 border-b last:border-b-0"
                  onClick={() => handleLocationSelect(location)}
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>{location.address}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
          
          <div className="bg-gray-100 rounded-md p-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-5 w-5 text-[#3665f3]" />
              <span className="font-medium">Selected: {tempLocation.address}</span>
            </div>
            <div className="text-sm text-gray-600">
              Lat: {tempLocation.lat.toFixed(4)}, Lng: {tempLocation.lng.toFixed(4)}
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Search Range: {range} miles</label>
              <span className="text-xs bg-[#3665f3]/10 text-[#3665f3] px-2 py-1 rounded">
                Max 100mi
              </span>
            </div>
            <div className="relative">
              <input
                type="range"
                min="1"
                max="100"
                value={range}
                onChange={(e) => handleRangeChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #3665f3 0%, #3665f3 ${range}%, #e5e7eb ${range}%, #e5e7eb 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1mi</span>
                <span>25mi</span>
                <span>50mi</span>
                <span>100mi</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleApply}>
              Apply Location
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LocationSelector;
