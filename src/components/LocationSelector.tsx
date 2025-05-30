
import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';

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
  const mapRef = useRef<HTMLDivElement>(null);

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
            {selectedLocation.range}km
          </span>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
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
          
          {/* Interactive Map */}
          <div className="h-64 bg-gray-100 rounded-md relative overflow-hidden border">
            <div 
              ref={mapRef}
              className="w-full h-full bg-gradient-to-br from-blue-100 to-green-100 relative cursor-move"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f0f0f0' fill-opacity='0.5'%3E%3Cpath d='m0 40l40-40h-40v40zm40 0v-40h-40l40 40z'/%3E%3C/g%3E%3C/svg%3E")`,
              }}
            >
              {/* Position Indicator */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  {/* Range Circle */}
                  <div 
                    className="absolute border-2 border-[#3665f3] border-opacity-30 bg-[#3665f3] bg-opacity-10 rounded-full"
                    style={{
                      width: `${Math.min(range * 2, 200)}px`,
                      height: `${Math.min(range * 2, 200)}px`,
                      left: `${-Math.min(range, 100)}px`,
                      top: `${-Math.min(range, 100)}px`,
                    }}
                  />
                  {/* Center Pin */}
                  <div className="w-6 h-6 bg-[#3665f3] rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                    <MapPin className="h-3 w-3 text-white" />
                  </div>
                </div>
              </div>
              
              {/* Map Controls */}
              <div className="absolute top-2 right-2 flex flex-col gap-1">
                <button className="w-8 h-8 bg-white rounded shadow flex items-center justify-center text-lg font-bold hover:bg-gray-50">+</button>
                <button className="w-8 h-8 bg-white rounded shadow flex items-center justify-center text-lg font-bold hover:bg-gray-50">-</button>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-100 rounded-md p-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-5 w-5 text-[#3665f3]" />
              <span className="font-medium">Selected: {tempLocation.address}</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Search Range: {range} km</label>
              <span className="text-xs bg-[#3665f3]/10 text-[#3665f3] px-2 py-1 rounded">
                Max 100km
              </span>
            </div>
            <Slider
              value={[range]}
              onValueChange={(value) => setRange(value[0])}
              max={100}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>1km</span>
              <span>25km</span>
              <span>50km</span>
              <span>100km</span>
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
