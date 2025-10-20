// components/payet/Paymentpayet.tsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createpayetOrder, resetPayment, setPaymentStatus } from '../../store/slices/payetSlice';
import { RootState, AppDispatch } from '../../store';
import { OrderCreateRequest } from '../../types/payet';
import { Button, CircularProgress, Typography, Box, Alert } from '@mui/material';
import { useRouter } from 'next/router';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@/hooks/useAuth';
import { PAYMENT_API_WS } from '@/api/payet';

interface PaymentProps {
  disabled: boolean;
}

const PaymentPayet: React.FC<PaymentProps> = ({disabled = true}) => {
  const dispatch: AppDispatch = useDispatch();
  const auth = useAuth() // Hook do zarządzania autentykacją
  const amount = useSelector((state: RootState) => state.payet.currentAmount); 
  // zmieniane na podstawie localStorage - przekazywane z zakładki /payetret
  const [statePaymentStatus, setStatePaymentStatus] = useState<string | null>(
    'idle'
  ); 
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  let myExtOrderId = '';

  useEffect(() => {
    setIsReady(true);
  }, []);

  const { loading, error, paymentRedirectUrl, currentOrderId, paymentStatus } = 
  useSelector(
    (state: RootState) => state.payet
  );

  // Funkcja do zapisu orderId do localStorage
  const saveOrderIdToLocalStorage = (orderId: string) => {
    localStorage.setItem('payet_current_order_id', orderId);
  };

  // Funkcja do odczytu orderId
/*  const getOrderIdFromLocalStorage = (): string | null => {
    return localStorage.getItem('payet_current_order_id');
  };
*/
  // Funkcja do usuwania orderId
  const removeOrderIdFromLocalStorage = () => {
    localStorage.removeItem('payet_current_order_id');
  };

  const generateOrderData = (): OrderCreateRequest => {
    const extOrderId = uuidv4();
    // Zapisz extOrderId, aby móc go odzyskać
    saveOrderIdToLocalStorage(extOrderId);
    let a='0'
    if (typeof(amount)=='number') {
      a=(100*amount).toString()
    }
    return {
      description: `Kod dostępu do kursu #${extOrderId}`,
      currencyCode: "PLN",
      totalAmount: a,
      products: [
        { name: "?", unitPrice: "1", quantity: amount.toString() },
      ],
      buyer: {
        email: auth.user?.email || '',
        firstName: "",
        lastName: "",
      },
      extOrderId: extOrderId,
    };
  };

  const handleStartPayment0 = () => {
    dispatch(resetPayment());
    const orderData = generateOrderData();
    dispatch(createpayetOrder(orderData));
  };


  const handleStartPayment = async () => {
    dispatch(resetPayment());
    const orderData = generateOrderData();
    // utworzenie zamówienia payet
//    seLocalExtOrderId(orderData.extOrderId || '')
    myExtOrderId=orderData.extOrderId || '';
    const result = await dispatch(createpayetOrder(orderData)).unwrap();
    //alert(JSON.stringify(result))
    /* alternatywa WebSocketListener */
    if (result?.jwtToken) {
      //alert('jest token!')
      console.debug('WebSocket: '+`${PAYMENT_API_WS}?token=${result.jwtToken}`)
      const ws = new WebSocket(`${PAYMENT_API_WS}?token=${result.jwtToken}`);
/*       if (ws) alert('jest ws')
       else alert('nieudany ws '+`${PAYMENT_API_WS}?token=`)
*/
      ws.onmessage = (event) => {
        //console.debug('jest status!')
        const data = JSON.parse(event.data);
        //console.debug(data.status)
        dispatch(setPaymentStatus(data.status)); // redux - to chyba zbędne
        setStatePaymentStatus(data.status)
      };
      ws.onclose = () => console.log("WebSocket closed");
    } else console.debug('Nie ma tokena JWT!')
    
    // przekierowanie do bramki payet
    window.open(result.redirectUri, "_blank");
  };

  const handleReset = () => {
    myExtOrderId='';
    dispatch(resetPayment());
  };

  // Obsługa powrotu z payet i inicjalizacja stanu z localStorage

  useEffect(() => { // zmiana localState - przekazywane z zakładki /payetret
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 's'+myExtOrderId) {
        setStatePaymentStatus(event.newValue);
      }
    };

    // Dodajemy nasłuchiwanie zdarzenia storage
    window.addEventListener('storage', handleStorageChange);

    // Czyszczenie nasłuchiwania przy odmontowaniu komponentu
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);


  useEffect(() => {
    if (statePaymentStatus === 'completed') {
      alert('Płatność zakończona sukcesem!');
      router.push('/account');
      removeOrderIdFromLocalStorage();
    } else if (statePaymentStatus === 'rejected' || statePaymentStatus === 'canceled') {
      alert('Płatność nie powiodła się lub została anulowana.');
      router.push('/account');
      removeOrderIdFromLocalStorage();
    }
  }, [statePaymentStatus, router]);

  return (
    <Box sx={{ my: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/*currentOrderId && <WebSocketListener /> */}
        {loading && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <CircularProgress size={24} sx={{ mr: 1 }} />
            <Typography>Przetwarzanie płatności...</Typography>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
            Błąd: {error}
          </Alert>
        )}

        {!loading && !paymentRedirectUrl && statePaymentStatus === 'idle' && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleStartPayment}
            sx={{ mt: 3 }}
            disabled={disabled}
          >
            Rozpocznij płatność w e-Talar
          </Button>
        )}
        {((statePaymentStatus !== 'idle') || paymentRedirectUrl) && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleReset}
            sx={{ mt: 3 }}
          >
            Resetuj
          </Button>
        )}
        {paymentRedirectUrl && (
          <Alert severity="info" sx={{ mt: 2, width: '100%' }}>
            Zostajesz przekierowany do bramki płatności payet...
          </Alert>
        )}

        {statePaymentStatus === 'completed' && (
          <Alert severity="success" sx={{ mt: 2, width: '100%' }}>
            Płatność zakończona sukcesem!
          </Alert>
        )}

        {['canceled', 'rejected'].includes(statePaymentStatus||'') && (
          <Alert severity="warning" sx={{ mt: 2, width: '100%' }}>
            Płatność nie powiodła się lub została anulowana. Status: {statePaymentStatus}
          </Alert>
        )}

        {statePaymentStatus === 'error' && (
          <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
            Wystąpił błąd podczas płatności. Spróbuj ponownie.
          </Alert>
        )}

        {statePaymentStatus === 'pending' && !loading && (
            <Alert severity="info" sx={{ mt: 2, width: '100%' }}>
                Oczekuję na aktualizację statusu płatności...
            </Alert>
        )}

      </Box>

  );
};

export default PaymentPayet;