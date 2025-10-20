// src/components/offers/OfferDetails.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Upewnij się, że masz react-router-dom
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
} from '@mui/material';
import { fetchOfferByIdApi } from '../../api/offer';
import { Offer } from '../../types/offer';

const OfferDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Pobierz ID z URL
  const [offer, setOffer] = useState<Offer | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('Brak ID oferty.');
      setIsLoading(false);
      return;
    }

    const loadOffer = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedOffer = await fetchOfferByIdApi(id);
        setOffer(fetchedOffer);
      } catch (err: any) {
        setError(err.message || 'Nie udało się załadować szczegółów oferty.');
      } finally {
        setIsLoading(false);
      }
    };
    loadOffer();
  }, [id]);

  if (isLoading) return <CircularProgress sx={{ m: 5 }} />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!offer) return <Alert severity="info">Nie znaleziono oferty.</Alert>;

  let price=''
  if ((offer.systemPrice !== null)&& (offer.systemPrice >0))
    price=offer.systemPrice !== null ? `${offer.systemPrice} ${offer.catalogCurrency}` : `${offer.catalogPrice} ${offer.catalogCurrency} (${offer.discountPercentage}% zniżki)`

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', p: 3, mt: 4 }}>
      <Card>
        <CardMedia
          component="img"
          height="300"
          image={offer.imageUrl || 'https://via.placeholder.com/400'}
          alt={offer.name}
          sx={{ objectFit: 'contain', p: 2 }}
        />
        <CardContent>
          <Typography gutterBottom variant="h4" component="div">
            {offer.name}
          </Typography>
          <Box sx={{ mb: 2 }}>
            {offer.categories.map((category : any) => (
              <Chip key={category} label={category} sx={{ mr: 1, mb: 1 }} color="primary" />
            ))}
          </Box>
          <Typography variant="body1" color="text.secondary" paragraph>
            {/* Tutaj powinieneś użyć komponentu renderującego RTF, np. dangerouslySetInnerHTML dla HTML */}
            <div dangerouslySetInnerHTML={{ __html: offer.description }} />
          </Typography>
          <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
            {price?'Cena:<b>'+price+'</b>':''}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Dostępna ilość: {offer.quantity} szt.
          </Typography>

          {offer.additionalRules && offer.additionalRules.length > 0 && (
            <Box sx={{ mt: 2, borderTop: '1px solid #eee', pt: 2 }}>
              <Typography variant="subtitle1">Dodatkowe Zasady:</Typography>
              <ul>
                {offer.additionalRules.map((rule, index) => (
                  <li key={index}>
                    <Typography variant="body2">{rule}</Typography>
                  </li>
                ))}
              </ul>
            </Box>
          )}

          <Button variant="contained" color="success" fullWidth sx={{ mt: 3 }}>
            Przejdź do zakupu
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default OfferDetails;