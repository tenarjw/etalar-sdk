// pages/home/index.tsx
import React from 'react';
import AllOffersGrid from 'src/components/offers/AllOffersGrid';
import { Box } from '@mui/material';


export default function Home() {

  return (
    <>
    <Box sx={{ p: 3 }}>
      <AllOffersGrid />
    </Box>
    </>
  );
}