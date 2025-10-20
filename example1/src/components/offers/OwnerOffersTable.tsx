// src/components/offers/OwnerOffersTable.tsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DataGrid, GridColDef, GridActionsCellItem, GridRowId } from '@mui/x-data-grid';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import AddIcon from '@mui/icons-material/Add';
import {
  fetchOwnerOffersApi,
  deleteOfferApi,
} from '../../api/offer';
import {
  setOwnerOffers,
  setOwnerOffersLoading,
  setOwnerOffersError,
  removeOfferFromList,
} from '../../store/offers/ownerOffersSlice';
import { RootState, AppDispatch } from '../../store';
import { Offer } from '../../types/offer';
import OfferForm from './OfferForm'; // Importuj formularz edycji

const OwnerOffersTable: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { offers, isLoading, error } = useSelector((state: RootState) => state.ownerOffers);

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedOfferToEdit, setSelectedOfferToEdit] = useState<Offer | null>(null);

         /* const fetchedOffers = await fetchOwnerOffersApi();
        dispatch(setOwnerOffers(fetchedOffers)); */
        
  useEffect(() => {
    const loadOwnerOffers = async () => {
      dispatch(setOwnerOffersError(''));
      dispatch(setOwnerOffersLoading(true));
      try {
 
        fetchOwnerOffersApi().then(
          res => { //alert('res');alert(res);
            dispatch(setOwnerOffers(res)) }
        ).catch(err => dispatch(setOwnerOffersError(err.message))).finally(() => dispatch(setOwnerOffersLoading(false)));
      } catch (err: any) {
        //alert('???'+err.message)
        dispatch(setOwnerOffersError(err.message || 'Błąd ładowania własnych ofert.'));
      } finally {
        dispatch(setOwnerOffersLoading(false));
      }
    };
    loadOwnerOffers();
  }, [dispatch]);


  const handleEditClick = (id: GridRowId) => () => {
    const offer = offers.find((o) => o.id === id);
    if (offer) {
      setSelectedOfferToEdit(offer);
      setOpenEditDialog(true);
    }
  };

  const handleDeleteClick = (id: GridRowId) => async () => {
    if (!window.confirm('Czy na pewno chcesz usunąć tę ofertę?')) {
      return;
    }
    dispatch(setOwnerOffersLoading(true)); // Ustaw loading dla całej tabeli
    try {
      const response = await deleteOfferApi(id as string);
      if (response.error === null) {
        dispatch(removeOfferFromList(id as string));
        // Możesz dodać alert sukcesu
      } else {
        dispatch(setOwnerOffersError(response.error));
      }
    } catch (err: any) {
      dispatch(setOwnerOffersError(err.message || 'Błąd usuwania oferty.'));
    } finally {
      dispatch(setOwnerOffersLoading(false));
    }
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedOfferToEdit(null);
    // Odśwież listę po zamknięciu dialogu edycji/tworzenia
    dispatch(setOwnerOffersLoading(true));
    fetchOwnerOffersApi().then(res => dispatch(setOwnerOffers(res))).catch(err => dispatch(setOwnerOffersError(err.message))).finally(
      () => dispatch(setOwnerOffersLoading(false)));
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Nazwa', width: 200, editable: false }, // Edycja w formularzu
    { field: 'quantity', headerName: 'Ilość', type: 'number', width: 100, editable: false },
    { field: 'catalogPrice', headerName: 'Cena Katalogowa', type: 'number', width: 150, editable: false },
    { field: 'catalogCurrency', headerName: 'Waluta', width: 90, editable: false },
    { field: 'systemPrice', headerName: 'Cena Systemowa', type: 'number', width: 150, editable: false,
      valueFormatter: (params) => params.value !== null ? params.value : 'N/A' },
    { field: 'discountPercentage', headerName: 'Zniżka (%)', type: 'number', width: 120, editable: false,
      valueFormatter: (params) => params.value !== null ? `${params.value}%` : 'N/A' },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Akcje',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edytuj"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
            key={id}
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Usuń"
            onClick={handleDeleteClick(id)}
            color="inherit"
            key={id}

          />,
        ];
      },
    },
  ];

  if (isLoading) return <CircularProgress sx={{ m: 5 }} />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ height: 600, width: '100%', mt: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Moje Oferty
      </Typography>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        sx={{ mb: 2 }}
        onClick={() => { setSelectedOfferToEdit(null); setOpenEditDialog(true); }}
      >
        Dodaj Nową Ofertę
      </Button>
      <DataGrid
        rows={offers}
        columns={columns}
        getRowId={(row) => row.id} // Ważne dla DataGrid, jeśli ID nie jest 'id'
        pageSizeOptions={[10, 25, 50]}
        initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
        }}
        // disableRowSelectionOnClick // Opcjonalnie, jeśli nie chcesz zaznaczać wierszy
      />

      <Dialog open={openEditDialog} onClose={handleCloseEditDialog} fullWidth maxWidth="md">
        <DialogTitle>{selectedOfferToEdit ? 'Edytuj Ofertę' : 'Dodaj Nową Ofertę'}</DialogTitle>
        <DialogContent>
          <OfferForm initialOfferData={selectedOfferToEdit || undefined} onSuccess={handleCloseEditDialog} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Anuluj</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OwnerOffersTable;