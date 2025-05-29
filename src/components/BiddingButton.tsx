
import React, { useState } from 'react';
import { Gavel } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

const BiddingButton = () => {
  const navigate = useNavigate();
  
  const handleBiddingClick = () => {
    navigate('/bidding');
  };
  
  return (
    <Button 
      variant="ghost" 
      onClick={handleBiddingClick}
      className="flex items-center gap-2 text-gray-700 hover:text-[#3665f3] hover:bg-[#3665f3]/10"
    >
      <Gavel className="h-5 w-5" />
      <span className="hidden md:inline">Bidding</span>
    </Button>
  );
};

export default BiddingButton;
