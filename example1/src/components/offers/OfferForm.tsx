// src/components/offers/OfferForm.tsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Alert,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  OutlinedInput,
  Checkbox,
  ListItemText,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import {
  setOfferFormData,
  setAdditionalRule,
  addAdditionalRule,
  removeAdditionalRule,
  resetOfferForm,
  setFormLoading,
  setFormError,
  setFormSuccessMessage,
} from '../../store/offers/offerFormSlice';
import { RootState, AppDispatch } from '../../store';
import { createOfferApi, updateOfferApi } from '../../api/offer';
import { fetchCategoriesApi } from '../../api/offer';
import { setCategories, setCategoriesLoading, setCategoriesError } from '../../store/offers/categorySlice';
import { Offer, OfferCategory, OfferFormData } from '../../types/offer';

import { SelectChangeEvent } from '@mui/material/Select'; // Typ dla onChange Select


interface OfferFormProps {
  initialOfferData?: Offer;
  onSuccess?: () => void;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const currencies = ['PLN', 'EUR', 'USD'];

const OfferForm: React.FC<OfferFormProps> = ({ initialOfferData, onSuccess }) => {
  const dispatch: AppDispatch = useDispatch();
  const offerForm = useSelector((state: RootState) => state.offerForm);
  const { categories, isLoading: categoriesLoading, error: categoriesError } = useSelector((state: RootState) => state.categories);

  const isEditing = !!initialOfferData;

  useEffect(() => {
    dispatch(resetOfferForm());
    if (isEditing && initialOfferData) {
      dispatch(setOfferFormData(initialOfferData));
    }
/*
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
    */
  }, [dispatch, isEditing, initialOfferData]);

  const handleChange = (field: keyof OfferFormData, value: any) => {
    dispatch(setOfferFormData({ [field]: value }));
  };

  // sygnatura i logika dla SelectChangeEvent
  const handleCategoriesChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    // W przypadku SelectChangeEvent z multiple, value jest już string[]
    dispatch(setOfferFormData({ categories: value as OfferCategory[] }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    dispatch(setFormError(null));
    dispatch(setFormSuccessMessage(null));
    dispatch(setFormLoading(true));

    if (!offerForm.name || !offerForm.description || /*offerForm.categories.length === 0 ||*/
         offerForm.quantity <= 0 || offerForm.catalogPrice <= 0 || !offerForm.catalogCurrency ) {
      dispatch(setFormError('Proszę wypełnić wszystkie wymagane pola i upewnić się, że wartości liczbowe są poprawne.'));
      dispatch(setFormLoading(false));
      return;
    }

    if (offerForm.systemPrice === null && offerForm.discountPercentage === null) {
      dispatch(setFormError('Podaj cenę dla użytkowników systemu LUB procent zniżki.'));
      dispatch(setFormLoading(false));
      return;
    }
    if (offerForm.systemPrice !== null && offerForm.discountPercentage !== null) {
      dispatch(setFormError('Podaj tylko cenę dla użytkowników systemu LUB procent zniżki, nie oba.'));
      dispatch(setFormLoading(false));
      return;
    }

    try {
      const dataToSend: OfferFormData = {
        ...offerForm,
        additionalRules: offerForm.additionalRules.filter(rule => rule.trim() !== '')
      };

      let response;
      if (isEditing && initialOfferData?.id) {
        response = await updateOfferApi(initialOfferData.id, dataToSend);
      } else {
        response = await createOfferApi(dataToSend);
      }

      if (response.error == null) {
        dispatch(setFormSuccessMessage(response.successMessage || (isEditing ? 'Oferta zaktualizowana pomyślnie!' : 'Oferta utworzona pomyślnie!')));
        if (!isEditing) {
          dispatch(resetOfferForm());
        }
        onSuccess?.();
      } else {
        dispatch(setFormError(response.error));
      }
    } catch (err: any) {
      dispatch(setFormError(err.message || 'Wystąpił nieoczekiwany błąd.'));
    } finally {
      dispatch(setFormLoading(false));
    }
  };

  return (
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root, .MuiFormControl-root': { m: 1, width: '45ch' },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        p: 3,
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        maxWidth: '600px',
        margin: '50px auto',
        backgroundColor: 'white',
      }}
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit}
    >
      <Typography variant="h5" component="h2" gutterBottom>
        {isEditing ? 'Edytuj Ofertę' : 'Dodaj Nową Ofertę'}
      </Typography>

      <TextField
        label="Nazwa Oferty"
        variant="outlined"
        value={offerForm.name}
        onChange={(e) => handleChange('name', e.target.value)}
        required
      />
      <TextField
        label="Kod produktu"
        variant="outlined"
        value={offerForm.productCode}
        onChange={(e) => handleChange('productCode', e.target.value)}
        required
      />
      <TextField
        label="Opis Oferty (RTF Text)"
        variant="outlined"
        multiline
        rows={4}
        value={offerForm.description}
        onChange={(e) => handleChange('description', e.target.value)}
        required
        helperText="W przyszłości będzie tu edytor RTF"
      />
      <TextField
        label="Link do Zdjęcia/Grafiki"
        variant="outlined"
        value={offerForm.imageUrl}
        onChange={(e) => handleChange('imageUrl', e.target.value)}
        helperText="Pełny URL do zdjęcia"
      />
      <TextField
        label="Link oferty"
        variant="outlined"
        value={offerForm.url}
        onChange={(e) => handleChange('url', e.target.value)}
        helperText="URL do oferty"
      />

{/*
      <FormControl sx={{ m: 1, width: '45ch' }}>
        <InputLabel id="offer-categories-label">Kategorie</InputLabel>
        <Select
          labelId="offer-categories-label"
          id="offer-categories-multiple-checkbox"
          multiple
          value={offerForm.categories}
          onChange={handleCategoriesChange} // Tutaj jest używana zmieniona funkcja
          input={<OutlinedInput label="Kategorie" />}
          renderValue={(selected) => (selected as string[]).join(', ')}
          MenuProps={MenuProps}
          required
          disabled={categoriesLoading}
        >
          {categoriesLoading ? (
            <MenuItem disabled><CircularProgress size={20} /></MenuItem>
          ) : categoriesError ? (
            <MenuItem disabled><Alert severity="error">{categoriesError}</Alert></MenuItem>
          ) : (
            categories.map((category) => (
              <MenuItem key={category} value={category}>
                <Checkbox checked={offerForm.categories.indexOf(category) > -1} />
                <ListItemText primary={category} />
              </MenuItem>
            ))
          )}
        </Select>
        {categoriesError && <Alert severity="error">{categoriesError}</Alert>}

      </FormControl>
*/}
      <TextField
        label="Ilość w Ofercie"
        variant="outlined"
        type="number"
        value={offerForm.quantity}
        onChange={(e) => handleChange('quantity', parseInt(e.target.value) || 0)}
        required
        inputProps={{ min: 1 }}
      />
      <TextField
        label="Cena Katalogowa"
        variant="outlined"
        type="number"
        value={offerForm.catalogPrice}
        onChange={(e) => handleChange('catalogPrice', parseFloat(e.target.value) || 0)}
        required
        inputProps={{ step: "0.01", min: 0 }}
      />
      <TextField
        select
        label="Waluta Katalogowa"
        variant="outlined"
        value={offerForm.catalogCurrency}
        onChange={(e) => handleChange('catalogCurrency', e.target.value)}
        required
      >
        {currencies.map((currency) => (
          <MenuItem key={currency} value={currency}>
            {currency}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="Cena dla Użytkowników Systemu"
        variant="outlined"
        type="number"
        value={offerForm.systemPrice ?? ''}
        onChange={(e) => handleChange('systemPrice', parseFloat(e.target.value) || null)}
        helperText="Podaj cenę LUB procent zniżki"
        inputProps={{ step: "0.01", min: 0 }}
      />
      <TextField
        label="Procent Zniżki (%)"
        variant="outlined"
        type="number"
        value={offerForm.discountPercentage ?? ''}
        onChange={(e) => handleChange('discountPercentage', parseFloat(e.target.value) || null)}
        helperText="Podaj procent zniżki LUB cenę dla użytkowników"
        inputProps={{ min: 0, max: 100 }}
      />

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>Dodatkowe Zasady (max 5)</Typography>
      {offerForm.additionalRules.map((rule, index) => (
        <Box key={index} sx={{ display: 'flex', alignItems: 'center', width: '45ch', m: 1 }}>
          <TextField
            label={`Zasada ${index + 1}`}
            variant="outlined"
            fullWidth
            value={rule}
            onChange={(e) => dispatch(setAdditionalRule({ index, value: e.target.value }))}
          />
          {offerForm.additionalRules.length > 1 && (
            <IconButton onClick={() => dispatch(removeAdditionalRule(index))}>
              <RemoveIcon />
            </IconButton>
          )}
        </Box>
      ))}
      {offerForm.additionalRules.length < 5 && (
        <Button onClick={() => dispatch(addAdditionalRule())} startIcon={<AddIcon />} sx={{ mt: 1 }}>
          Dodaj zasadę
        </Button>
      )}

      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{ mt: 3, width: '25ch' }}
        disabled={offerForm.isLoading}
      >
        {offerForm.isLoading ? <CircularProgress size={24} color="inherit" /> : (isEditing ? 'Zapisz Zmiany' : 'Utwórz Ofertę')}
      </Button>

      {offerForm.error && (
        <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
          {offerForm.error}
        </Alert>
      )}
      {offerForm.successMessage && (
        <Alert severity="success" sx={{ mt: 2, width: '100%' }}>
          {offerForm.successMessage}
        </Alert>
      )}
    </Box>
  );
};

export default OfferForm;