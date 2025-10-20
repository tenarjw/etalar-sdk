import React, { useEffect, useCallback } from 'react'; // Add useCallback import
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  TextField,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import {
  fetchAllOffersApi,
} from '../../api/offer';
import { fetchCategoriesApi } from '../../api/offer';
import {
  setAllOffers,
  setAllOffersLoading,
  setAllOffersError,
  setSearchQuery,
  setSelectedCategories,
} from '../../store/offers/allOffersSlice';
import { setCategories, setCategoriesLoading, setCategoriesError } from '../../store/offers/categorySlice';
import { RootState, AppDispatch } from '../../store';
import { OfferCategory } from '../../types/offer';
import { SelectChangeEvent } from '@mui/material/Select';
import Link from 'next/link';

const AllOffersGrid: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { offers, isLoading, error, searchQuery, selectedCategories } = useSelector((state: RootState) => state.allOffers);
  //const { categories, isLoading: categoriesLoading, error: categoriesError } = useSelector((state: RootState) => state.categories);

  // Inicjalizacja routera - przycisk otwarcia oferty
  const router = useRouter();

  const loadOffers = useCallback(async () => {
    dispatch(setAllOffersLoading(true));
    try {
      fetchAllOffersApi(searchQuery, selectedCategories).then (        
           fetchedOffers => { dispatch(setAllOffers(fetchedOffers)) }
      ).catch(err => console.error(err))
    } catch (err: any) {
      dispatch(setAllOffersError(err.message || 'Błąd ładowania ofert.'));
    } finally {
      dispatch(setAllOffersLoading(false));
    }
  }, [dispatch, searchQuery, selectedCategories]); // Dependencies for loadOffers

  // Ładowanie kategorii przy pierwszym montowaniu
  useEffect(() => {
    const loadCategories = async () => {
      dispatch(setCategoriesLoading(true));
      try {
        const fetchedCategories = await fetchCategoriesApi();
        dispatch(setCategories(fetchedCategories));
      } catch (err: any) {
        dispatch(setCategoriesError(err.message || 'Błąd ładowania kategorii.'));
      } finally {
        dispatch(setCategoriesLoading(false));
      }
    };
    loadCategories();
  }, [dispatch]);

  // Ładowanie ofert przy zmianie zapytań wyszukiwania/kategorii
  
  useEffect(() => {
    const handler = setTimeout(() => {
      loadOffers();
    }, 500); // Debounce
    return () => clearTimeout(handler);
  }, [loadOffers]); // Only depend on loadOffers

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(event.target.value));
  };

  const handleCategoriesChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    dispatch(setSelectedCategories(typeof value === 'string' ? value.split(',') : value as OfferCategory[]));
  };

  if (isLoading) return <CircularProgress sx={{ m: 5 }} />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
       Katalog Kursów
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, justifyContent: 'center' }}>
        <TextField
          label="Szukaj po nazwie"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ width: '40ch' }}
        />
      </Box>

      <Grid container spacing={3}>
        {/* do uzupełnienia */}
          <Grid item xs={12}>
            <Alert severity="info" sx={{ width: '100%' }}>Brak dostępnych ofert spełniających kryteria wyszukiwania.</Alert>
          </Grid>
      </Grid>
    </Box>
  );
};

export default AllOffersGrid;