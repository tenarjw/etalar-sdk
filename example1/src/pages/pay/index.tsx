// pages/etbuy/index.tsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField,
  Typography,
  Paper,
  Alert,
  Link,
} from "@mui/material";
import { isValidEmail } from '../../utils/validation';
import { useDispatch, useSelector } from 'react-redux'; 
import { useAuth } from '../../hooks/useAuth';
import { AppDispatch, RootState } from '../../store'; 
import { setCurrentAmount, resetPayment } from '../../store/slices/payetSlice'; 
 
import PaymentPayet from '../../components/payet/PaymentPayet';
import { useRouter } from "next/router";


export default function Payment() {
  const amount = useSelector((state: RootState) => state.payet.currentAmount); 
  const [email, setEmail] = useState<string>("");
  const [product, setProduct] = useState<string>("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [formValidationError, setFormValidationError] = useState<string | null>(null); // Błędy walidacji formularza na froncie

  const dispatch = useDispatch<AppDispatch>();
  const auth = useAuth();

  const router = useRouter();

  // Pobierz stan płatności z Redux Store
  const { error: paymentError, paymentRedirectUrl, paymentStatus } = useSelector(
    (state: RootState) => state.payet
  );
 
  const isLoading = ()=> (paymentStatus=='pending');
  const isSuccess = ()=> (paymentStatus=='completed');

    useEffect(() => {
    // router.isReady zapewnia, że obiekt router.query jest już w pełni dostępny
    // w przeglądarce klienta. Bez tego przy pierwszym renderowaniu query może być puste.
    if (router.isReady) {
      const { price, product } = router.query;
      
      if (price) {
        dispatch(setCurrentAmount(Number.parseFloat(String(price))));
      }
      if (product) {
        setProduct(String(product));
      }
    }
  }, [router.isReady, router.query]); // Efekt uruchomi się, gdy router będzie gotowy

  useEffect(() => {
    if (auth?.user?.email) {
      setEmail(auth.user.email);
    }
  }, [auth]);


  // Efekt do obsługi przekierowania po pomyślnej inicjacji płatności
  useEffect(() => {
    if (paymentRedirectUrl && isSuccess()) {
      // Upewnij się, że przekierowujesz tylko raz
      setTimeout(() => { // Daj czas na wyświetlenie komunikatu sukcesu
        window.location.href = paymentRedirectUrl;
        dispatch(resetPayment()); // Zresetuj stan Redux po przekierowaniu
      }, 1500); 
    }
  }, [paymentRedirectUrl, paymentStatus, dispatch]);

  // Efekt do resetowania błędów walidacji formularza przy zmianie kwoty/emaila/akceptacji regulaminu
  useEffect(() => {
    if (formValidationError) {
        setFormValidationError(null);
    }
  }, [amount, email, acceptedTerms, formValidationError]);


  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || (Number(value) >= 0 && !isNaN(Number(value)))) {
       dispatch(setCurrentAmount(Number(value)));
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleAcceptTerms = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAcceptedTerms(e.target.checked);
  };


  const currentError = formValidationError || paymentError;

  return (
    <Paper elevation={3} sx={{ maxWidth: 500, margin: "auto", p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Opłata {product?"za "+product:""}
      </Typography>
      <Box component="form" noValidate autoComplete="off">
        <FormGroup>
          <TextField
            label="Kwota (eT)"
            type="number"
            variant="outlined"
            value={amount}
            onChange={handleAmountChange}
            margin="normal"
            fullWidth
            inputProps={{ min: 0.01, step: 0.01 }}
            required
            error={!!currentError && ( amount <= 0)}
            helperText={!!currentError && (amount <= 0) ? "Kwota musi być większa od zera." : ""}
          />
          <TextField
            label="Twój adres Email"
            type="email"
            variant="outlined"
            value={email}
            onChange={handleEmailChange}
            margin="normal"
            fullWidth
            required
            error={!!currentError && (!email || !isValidEmail(email))}
            helperText={!!currentError && (!email || !isValidEmail(email)) ? "Wprowadź poprawny adres email." : ""}
          />
          <FormControlLabel
            sx={{ mt: 2 }}
            control={
              <Checkbox
                checked={acceptedTerms}
                onChange={handleAcceptTerms}
                name="acceptTerms"
                color="primary"
              />
            }
            label="Akceptuję regulamin płatności "
          /><Link href="/regulamin_platnosci" target="_blank" rel="noreferrer">
              (<b>treść regulaminu</b>)
            </Link>
          <p>
            Sprzedawca:
             <Link href="/about" underline="always"
              target="_blank" rel="noreferrer">
                <strong>Twoja Firma</strong> z siedzibą w ..., NIP: <b>9999999999</b>
              </Link>
              <br />
              Produkt: <strong>Nazwa produktu</strong>
          </p>
          <hr />
          {currentError && <Alert severity="error" sx={{ mb: 2 }}>{currentError}</Alert>}
          {isSuccess() && <Alert severity="success" sx={{ mb: 2 }}>Płatność zainicjowana! Przekierowuję...</Alert>}
          <PaymentPayet 
          disabled={isLoading() || amount == 0 || amount <= 0 || !email || !isValidEmail(email)
             || !acceptedTerms}
           />
        </FormGroup>
      </Box>

    </Paper>
  );
}


