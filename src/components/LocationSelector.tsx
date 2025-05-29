
import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Search, Slider } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface LocationSelectorProps {
  onLocationChange: (location: { lat: number; lng: number; address: string; range: number }) => void;
}

const LocationSelector = ({ onLocationChange }: LocationSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState({
    lat: 40.7128,
    lng: -74.0060,
    address: 'New York, NY, USA'
  });
  const [range, setRange] = useState(25);
  const mapRef = useRef<HTMLDivElement>(null);

  const mockLocations = [
    { address: 'New York, NY, USA', lat: 40.7128, lng: -74.0060 },
    { address: 'Los Angeles, CA, USA', lat: 34.0522, lng: -118.2437 },
    { address: 'Chicago, IL, USA', lat: 41.8781, lng: -87.6298 },
    { address: 'Houston, TX, USA', lat: 29.7604, lng: -95.3698 },
    { address: 'Phoenix, AZ, USA', lat: 33.4484, lng: -112.0740 }
  ];

  const filteredLocations = mockLocations.filter(loc =>
    loc.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLocationSelect = (location: typeof selectedLocation) => {
    setSelectedLocation(location);
    onLocationChange({ ...location, range });
  };

  const handleRangeChange = (newRange: number) => {
    setRange(newRange);
    onLocationChange({ ...selectedLocation, range: newRange });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span className="hidden md:inline">
            {selectedLocation.address} • {range}km
          </span>
          <span className="md:hidden">{range}km</span>
        </Button>
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
                  onClick={() => {
                    handleLocationSelect(location);
                    setSearchQuery('');
                  }}
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>{location.address}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
          
          <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center" ref={mapRef}>
            <div className="text-center text-gray-500">
              <MapPin className="h-8 w-8 mx-auto mb-2" />
              <p>Interactive Map</p>
              <p className="text-sm">Click to select location</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Range: {range} km</label>
              <span className="text-xs text-gray-500">Max 500km</span>
            </div>
            <div className="relative">
              <input
                type="range"
                min="0"
                max="500"
                value={range}
                onChange={(e) => handleRangeChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0km</span>
                <span>250km</span>
                <span>500km</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsOpen(false)}>
              Apply
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LocationSelector;
